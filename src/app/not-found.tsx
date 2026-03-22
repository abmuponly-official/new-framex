import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-brand-gray-300 text-8xl font-bold mb-6 select-none">404</p>
      <h1 className="text-2xl font-semibold text-brand-black mb-3">
        Trang không tồn tại
      </h1>
      <p className="text-brand-gray-500 mb-8 max-w-sm">
        Trang bạn đang tìm không còn ở đây. Có thể nó đã được di chuyển hoặc xóa.
      </p>
      <div className="flex gap-4">
        <Link
          href="/vi"
          className="px-6 py-2.5 bg-brand-black text-brand-white text-sm font-medium hover:bg-brand-gray-800 transition-colors rounded-sm"
        >
          Về trang chủ
        </Link>
        <Link
          href="/vi/lien-he"
          className="px-6 py-2.5 border border-brand-gray-200 text-brand-gray-600 text-sm font-medium hover:border-brand-black hover:text-brand-black transition-colors rounded-sm"
        >
          Liên hệ FrameX
        </Link>
      </div>
    </div>
  );
}
