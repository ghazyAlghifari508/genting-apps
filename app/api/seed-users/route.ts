import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (process.env.ENABLE_SEED_API !== "true") {
    return NextResponse.json({ error: "Seed endpoint disabled" }, { status: 403 });
  }

  const seedSecret = process.env.SEED_USERS_SECRET;
  const providedSecret = request.headers.get("x-seed-secret");
  if (!seedSecret || providedSecret !== seedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const doctorPassword = process.env.SEED_DOCTOR_PASSWORD;
  const userPassword = process.env.SEED_USER_PASSWORD;

  if (!serviceRoleKey || !adminPassword || !doctorPassword || !userPassword) {
    return NextResponse.json({ error: "Seed configuration missing" }, { status: 500 });
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

    const results = [];

    // 1. Cleanup
    const emails = users.map(u => u.email);
    // Be careful with delete, ideally we should just upsert
    // But since we want a clean state for these test users:
    await supabaseAdmin.from('profiles').delete().in('email', emails);

    // 2. Insert Users
    for (const u of users) {
      // Manage Auth User
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;
      
      const existingAuthUser = listData.users.find(au => au.email === u.email);
      let userId;

      if (existingAuthUser) {
         userId = existingAuthUser.id;
         await supabaseAdmin.auth.admin.updateUserById(userId, {
           password: u.password,
           user_metadata: {
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
             full_name: u.name,
             username: u.username,
             role: u.role
           }
         });
         if (authError) throw authError;
         userId = authData.user.id;
      }

      // Manage Profile
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: u.email,
        username: u.username,
        full_name: u.name,
        role: u.role,
        onboarding_completed: true
      }, { onConflict: 'id' });

      // Doctor Record
      if (u.role === 'doctor') {
         await supabaseAdmin.from('doctors').upsert({
           user_id: userId,
           full_name: u.name,
           email: u.email,
           specialization: 'Umum',
           license_number: 'DUMMY-' + Math.random().toString(36).slice(7),
           is_verified: true,
           registration_status: 'approved',
           hourly_rate: 50000
         }, { onConflict: 'user_id' });
      }

      results.push({ email: u.email, status: 'processed', userId });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown seeding error';
    console.error("Seeding error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
