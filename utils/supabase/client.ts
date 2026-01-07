// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
    console.log('--- Supabase Auth Debug ---');
    console.log('Env URL:', envUrl);
    console.log('Env Key exists:', !!envKey);
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

export const supabase = createClient(supabaseUrl, supabaseKey);
