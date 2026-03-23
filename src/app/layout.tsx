import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | FrameX',
    default: 'FrameX — Giải pháp 3-trong-1 cho phần khung và vỏ công trình',
  },
  description:
    'FrameX tích hợp kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện trong một đơn vị thực hiện duy nhất.',
  metadataBase: new URL('https://framex.vn'),
  openGraph: {
    siteName: 'FrameX',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'FrameX' }],
  },
  // twitter:site intentionally omitted — no active Twitter/X account yet
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
