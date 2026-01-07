// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Robust URL processing to handle common typos (like missing 'h' in https)
let supabaseUrl = envUrl || 'https://placeholder.supabase.co';

if (supabaseUrl !== 'https://placeholder.supabase.co') {
    // Trim whitespace
    supabaseUrl = supabaseUrl.trim();

    // Fix common typo: ttps:// -> https://
    if (supabaseUrl.startsWith('ttps://')) {
        supabaseUrl = 'h' + supabaseUrl;
    }

    // Ensure protocol exists
    if (!supabaseUrl.startsWith('http')) {
        supabaseUrl = `https://${supabaseUrl}`;
    }
}

const supabaseKey = envKey || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
