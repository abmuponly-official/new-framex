import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth guard for /admin/dashboard routes.
 * Does NOT wrap in AdminShell — each page handles its own AdminShell
 * to avoid double-nesting (layout AdminShell → page AdminShell).
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Pass through — AdminShell is rendered by the child page itself
  return <>{children}</>;
}
