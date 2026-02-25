import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

// Load env vars
dotenv.config({ path: ".env.local" });

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const doctorPassword = process.env.SEED_DOCTOR_PASSWORD;
  const userPassword = process.env.SEED_USER_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey || !adminPassword || !doctorPassword || !userPassword) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const users = [
      {
        email: "admin@genting.id",
        password: adminPassword,
        name: "Admin Genting",
        role: "admin",
        username: "admin_genting"
      },
      {
        email: "doctor@genting.id",
        password: doctorPassword,
        name: "Dr. Genting Hebat",
        role: "doctor",
        username: "dokter_genting"
      },
      {
        email: "user@genting.id",
        password: userPassword,
        name: "Bunda Genting",
        role: "user",
        username: "bunda_genting"
      }
    ];

    console.log("Starting seeding process via Supabase SDK...");

    // Pre-cleanup app tables by email and username
    const emails = users.map(u => u.email);
    const usernames = users.map(u => u.username);
    console.log("Cleaning up target user profiles and usernames...");
    await supabaseAdmin.from('profiles').delete().in('email', emails);
    await supabaseAdmin.from('profiles').delete().in('username', usernames);
    // Note: doctors table will cascade or we can delete manually if needed
    // But since we are cleaning profiles, that should remove most conflicts.

    for (const u of users) {
      console.log(`Processing ${u.email}...`);
      
      // 1. Manage Auth User
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      
      const existingAuthUser = listData.users.find(au => au.email === u.email);
      let userId;

      if (existingAuthUser) {
         userId = existingAuthUser.id;
         console.log(`User already exists in Auth: ${userId}`);
         // Update metadata just in case
         await supabaseAdmin.auth.admin.updateUserById(userId, {
           user_metadata: {
             name: u.name,
             full_name: u.name,
             username: u.username,
             role: u.role
           }
         });
      } else {
         const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
           email: u.email,
           password: u.password,
           email_confirm: true,
           user_metadata: {
             name: u.name,
             full_name: u.name,
             username: u.username,
             role: u.role
           }
         });
         if (authError) throw authError;
         userId = authData.user.id;
         console.log(`Created new Auth user: ${userId}`);
      }

      // 2. Manage Profile
      console.log(`Upserting profile for ${u.email}...`);
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          email: u.email,
          username: u.username,
          full_name: u.name,
          role: u.role,
          onboarding_completed: true,
          pregnancy_week: u.role === 'user' ? 12 : 0
        }, { onConflict: 'id' });
      
      if (profileError) {
        console.error(`Profile upsert error for ${u.email}:`, profileError);
        throw profileError;
      }

      // 3. Manage Doctor Record
      if (u.role === 'doctor') {
         console.log(`Upserting doctor record for ${u.email}...`);
         // Check if doctor exists
         const { data: existingDoctor } = await supabaseAdmin
           .from('doctors')
           .select('id')
           .eq('user_id', userId)
           .single();

         const { error: doctorError } = await supabaseAdmin
           .from('doctors')
           .upsert({
             id: existingDoctor?.id || uuidv4(),
             user_id: userId,
             full_name: u.name,
             email: u.email,
             specialization: 'Umum',
             license_number: 'DUMMY-' + Math.random().toString(36).slice(7),
             is_verified: true,
             registration_status: 'approved',
             hourly_rate: 50000
           }, { onConflict: 'user_id' });
         
         if (doctorError) {
           console.error(`Doctor upsert error for ${u.email}:`, doctorError);
           throw doctorError;
         }
      }
    }

    console.log("Seeding successful!");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown seeding error';
    console.error("Seeding error:", error);
    console.error("Seeding error detail:", errorMessage);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
