'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const NAV = [
  { href: '/admin/dashboard', label: 'Tổng quan', icon: '📊' },
  { section: 'Nội dung' },
  { href: '/admin/projects', label: 'Dự án', icon: '🏗️' },
  { href: '/admin/posts', label: 'Bài viết / Blog', icon: '📝' },
  { section: 'Vận hành' },
  { href: '/admin/leads', label: 'Khách hàng tiềm năng', icon: '📬' },
  { section: 'Hệ thống' },
  { href: '/admin/settings', label: 'Cài đặt', icon: '⚙️' },
  { href: '/admin/audit', label: 'Nhật ký thay đổi', icon: '📋' },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  // Derive page title from pathname
  const matchedNav = NAV.find(
    (n) => 'href' in n && typeof n.href === 'string' && pathname.startsWith(n.href) && n.href !== '/admin/dashboard'
  );
  const pageTitle: string =
    (matchedNav && 'label' in matchedNav ? matchedNav.label : undefined) ??
    (pathname === '/admin/dashboard' ? 'Tổng quan' : 'Admin');

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span>FrameX</span>
          <span className="admin-sidebar-badge">CMS</span>
        </div>

        <nav className="admin-nav">
          {NAV.map((item, i) => {
            if ('section' in item) {
              return (
                <div key={i} className="admin-nav-section">
                  {item.section}
                </div>
              );
            }
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link${active ? ' active' : ''}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ fontSize: 12, marginBottom: 8, wordBreak: 'break-all' }}>
            {user.email}
          </div>
          <button className="admin-nav-link" onClick={handleLogout}>
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{pageTitle}</h1>
          <div className="admin-topbar-actions">
            <Link
              href="/vi"
              target="_blank"
              className="btn btn-secondary btn-sm"
            >
              🌐 Xem website
            </Link>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
