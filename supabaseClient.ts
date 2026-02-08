import { createClient } from '@supabase/supabase-js';

// Using placeholder values to prevent app crash when environment variables are not set.
// This allows the application to load, although data fetching from Supabase will fail
// until correct credentials are provided.
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
