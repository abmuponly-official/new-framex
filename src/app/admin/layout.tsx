import './admin.css';

export const metadata = {
  title: { template: '%s | FrameX Admin', default: 'FrameX Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="admin-body">{children}</body>
    </html>
  );
}
