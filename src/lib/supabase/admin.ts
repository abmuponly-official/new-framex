import { createClient } from '@supabase/supabase-js';

/**
 * Admin client — uses SERVICE_ROLE_KEY.
 * NEVER import this in client-side code or expose to browser.
 * Server-side only: API routes, server actions, admin pages.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
