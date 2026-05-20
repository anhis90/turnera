import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safe initialization
let supabaseClient;
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

if (isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'your-anon-key') {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    supabaseClient = null;
  }
} else {
  // Mock client fallback for development
  supabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    })
  };
}

export const supabase = supabaseClient;

