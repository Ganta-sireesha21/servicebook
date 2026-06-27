import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env');
}

if (supabaseServiceRoleKey.includes('publishable') || supabaseServiceRoleKey.startsWith('sb_')) {
  console.warn(
    'WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be a publishable or anon-style key. If Supabase row-level security is enabled, inserts/updates from the backend may fail. Use the service_role key from Supabase Settings > API.'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("KEY EXISTS:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("KEY PREFIX:", process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));

export default supabase;
