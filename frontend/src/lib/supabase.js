import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_DB_URL,
  import.meta.env.VITE_DB_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
