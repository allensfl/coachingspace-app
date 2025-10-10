import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL und Key müssen in .env.local gesetzt werden und mit VITE_ beginnen')
}

export const supabase = createClient(supabaseUrl, supabaseKey);
