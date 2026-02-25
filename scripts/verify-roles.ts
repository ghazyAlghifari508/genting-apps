
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyRoles() {
  console.log('🔍 Verifying User Roles in Database...\n');

  const emails = ['admin@genting.id', 'doctor@genting.id', 'user@genting.id'];

  for (const email of emails) {
    // 1. Check Auth User (Metadata)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error(`❌ Failed to fetch auth users: ${authError.message}`);
      return;
    }
    const authUser = users.find(u => u.email === email);

    if (!authUser) {
      console.log(`❌ Auth User ID not found for ${email}`);
      continue;
    }

    // 2. Check Profile (Public Table)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    console.log(`👤 Email: ${email}`);
    console.log(`   ID: ${authUser.id}`);
    console.log(`   Auth Metadata Role: ${authUser.user_metadata?.role || 'null'}`);
    
    if (profile) {
      console.log(`   DB Profile Role:    ${profile.role}`);
      
      if (profile.role !== authUser.user_metadata?.role) {
        console.warn(`   ⚠️  MISMATCH DETECTED! DB says '${profile.role}' but Auth says '${authUser.user_metadata?.role}'`);
        
        // Auto-fix attempt
        console.log(`   🛠️  Fixing mismatch... updating Auth metadata to '${profile.role}'`);
        await supabase.auth.admin.updateUserById(authUser.id, {
          user_metadata: { role: profile.role }
        });
        console.log(`   ✅  Fixed.`);
      } else {
        console.log(`   ✅  Sync OK.`);
      }
    } else {
      console.error(`   ❌ DB Profile not found! Error: ${profileError?.message}`);
    }
    console.log('--------------------------------------------------');
  }
}

verifyRoles().catch(console.error);
