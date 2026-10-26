// Supabase client initialization with graceful fallback
// ConceptX operates in local-first mode with seed data, and seamlessly syncs to Supabase when configured.

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export interface SyncStatus {
  online: boolean;
  configured: boolean;
  provider: 'local-first' | 'supabase';
}

export function getSyncStatus(): SyncStatus {
  return {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    configured: isSupabaseConfigured(),
    provider: isSupabaseConfigured() ? 'supabase' : 'local-first',
  };
}
