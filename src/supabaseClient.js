
import { createClient } from '@supabase/supabase-js'

// Correctly import the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// This creates a single, correctly configured Supabase client for your entire app.
export const supabase = createClient(supabaseUrl, supabaseKey);
