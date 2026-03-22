import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | FrameX',
    default: 'FrameX — Giải pháp 3-trong-1 cho phần khung và vỏ công trình',
  },
  description:
    'FrameX tích hợp kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện trong một đơn vị thực hiện duy nhất.',
  metadataBase: new URL('https://framex.vn'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
