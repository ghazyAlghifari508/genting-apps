import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

async function nuke() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("Fetching all users to nuke...");
  
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000
  });

  if (error) {
    console.error("Error listing users:", error);
    process.exit(1);
  }

  console.log(`Found ${users.length} users. Commencing total annihilation...`);

  for (const user of users) {
    console.log(`Deleting user: ${user.email} (${user.id})...`);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Failed to delete ${user.email}:`, deleteError.message);
    }
  }

  console.log("Auth tables cleared. (App tables will be cleared if ON DELETE CASCADE is set)");
  process.exit(0);
}

nuke();
