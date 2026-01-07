// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate URL format to prevent build errors
const supabaseUrl = (envUrl && (envUrl.startsWith('https://') || envUrl.startsWith('http://')))
    ? envUrl
    : 'https://placeholder.supabase.co';

const supabaseKey = envKey || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
