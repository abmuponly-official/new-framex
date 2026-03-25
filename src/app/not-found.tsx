import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Use `absolute` so the root layout title template ('%s | FrameX') is NOT applied,
  // preventing the rendered title from becoming "404 — Page not found | FrameX | FrameX".
  title: { absolute: '404 — Page not found | FrameX' },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-brand-gray-300 text-8xl font-bold mb-6 select-none" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-semibold text-brand-black mb-1">
        Trang không tồn tại
      </h1>
      <p className="text-brand-gray-400 text-sm mb-1">Page not found</p>
      <p className="text-brand-gray-500 mb-8 max-w-sm text-sm leading-relaxed mt-3">
        Trang bạn đang tìm không còn ở đây.&nbsp;
        <span className="text-brand-gray-400">/ The page you&apos;re looking for doesn&apos;t exist.</span>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/vi"
          className="px-6 py-2.5 bg-brand-black text-brand-white text-sm font-medium
            hover:bg-brand-gray-800 transition-colors rounded-sm focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-brand-black"
        >
          Về trang chủ
        </Link>
        <Link
          href="/en"
          className="px-6 py-2.5 border border-brand-gray-200 text-brand-gray-600 text-sm font-medium
            hover:border-brand-black hover:text-brand-black transition-colors rounded-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gray-400"
        >
          Go to homepage
        </Link>
        <Link
          href="/vi/lien-he"
          className="px-6 py-2.5 border border-brand-gray-200 text-brand-gray-600 text-sm font-medium
            hover:border-brand-black hover:text-brand-black transition-colors rounded-sm
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gray-400"
        >
          Liên hệ FrameX
        </Link>
      </div>
    </div>
  );
}
