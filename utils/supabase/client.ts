// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log the status of environment variables (Masked for security)
if (typeof window !== 'undefined') {
    console.log('[Supabase Client] NEXT_PUBLIC_SUPABASE_URL present:', !!envUrl);
    if (envUrl) console.log('[Supabase Client] URL starts with:', envUrl.substring(0, 10));
    console.log('[Supabase Client] NEXT_PUBLIC_SUPABASE_ANON_KEY present:', !!envKey);
}

// Robust URL processing
let supabaseUrl = (envUrl && envUrl.trim()) || 'https://placeholder.supabase.co';

if (supabaseUrl !== 'https://placeholder.supabase.co') {
    // Handle double-h typo or missing h
    if (supabaseUrl.startsWith('ttps://')) {
        supabaseUrl = 'h' + supabaseUrl;
    } else if (!supabaseUrl.startsWith('http')) {
        supabaseUrl = `https://${supabaseUrl}`;
    }
}

const supabaseKey = (envKey && envKey.trim()) || 'placeholder';

if (typeof window !== 'undefined') {
    console.log('[Supabase Client] Initializing with URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
