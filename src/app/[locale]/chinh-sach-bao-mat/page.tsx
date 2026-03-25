import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';
import { buildOpenGraph, buildAlternates } from '@/lib/seo';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const description = locale === 'vi'
    ? 'Tìm hiểu cách FrameX thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi truy cập framex.vn.'
    : 'Learn how FrameX collects, uses and protects your personal information when you visit framex.vn.';
  return {
    title: t('title'),
    description,
    alternates: buildAlternates(locale, '/chinh-sach-bao-mat'),
    openGraph: buildOpenGraph({
      locale,
      title: t('title'),
      description,
      url: `https://framex.vn/${locale}/chinh-sach-bao-mat`,
    }),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const isVI = locale === 'vi';

  const sections = isVI ? [
    {
      title: '1. Phạm vi áp dụng',
      body: 'Chính sách này áp dụng cho mọi thông tin được thu thập thông qua website framex.vn, bao gồm biểu mẫu liên hệ, gửi hồ sơ dự án và các tương tác khác trên nền tảng kỹ thuật số của FrameX.',
    },
    {
      title: '2. Thông tin chúng tôi thu thập',
      body: 'Thông tin liên hệ (họ tên, số điện thoại, email); thông tin dự án (loại công trình, mô tả, ngân sách); tài liệu bạn chủ động gửi (mặt bằng, concept, RFQ); thông tin kỹ thuật (địa chỉ IP, loại trình duyệt, thời gian truy cập) phục vụ mục đích bảo mật và cải thiện dịch vụ.',
    },
    {
      title: '3. Mục đích sử dụng',
      body: 'Chúng tôi sử dụng thông tin của bạn để: phản hồi tư vấn và đề xuất giải pháp phù hợp; liên lạc về dự án đã gửi; cải thiện trải nghiệm trên website; đảm bảo an toàn hệ thống. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba ngoài mục đích trên.',
    },
    {
      title: '4. Quyền của bạn',
      body: 'Bạn có quyền: truy cập thông tin cá nhân chúng tôi đang lưu trữ; yêu cầu chỉnh sửa hoặc xóa; phản đối việc xử lý dữ liệu; rút lại sự đồng ý. Để thực hiện các quyền này, vui lòng liên hệ hello@framex.vn.',
    },
    {
      title: '5. Bảo mật dữ liệu',
      body: 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn. Tuy nhiên, không có phương thức truyền tải dữ liệu nào qua internet là tuyệt đối an toàn.',
    },
    {
      title: '6. Thay đổi chính sách',
      body: 'Chúng tôi có thể cập nhật chính sách này theo thời gian. Phiên bản mới nhất sẽ luôn được đăng tải trên trang này với ngày cập nhật rõ ràng.',
    },
  ] : [
    {
      title: '1. Scope',
      body: 'This policy applies to all information collected through framex.vn, including contact forms, project document submissions, and other interactions on FrameX\'s digital platforms.',
    },
    {
      title: '2. Information we collect',
      body: 'Contact information (name, phone, email); project information (type, description, budget); documents you voluntarily submit (floor plans, concepts, RFQs); technical information (IP address, browser type, access time) for security and service improvement purposes.',
    },
    {
      title: '3. How we use it',
      body: 'We use your information to: respond to inquiries and propose appropriate solutions; communicate about submitted projects; improve website experience; ensure system security. We do not sell, rent, or share your personal information with third parties beyond these purposes.',
    },
    {
      title: '4. Your rights',
      body: 'You have the right to: access personal information we hold; request correction or deletion; object to data processing; withdraw consent. To exercise these rights, contact hello@framex.vn.',
    },
    {
      title: '5. Data security',
      body: 'We apply appropriate technical and organizational measures to protect your information. However, no method of data transmission over the internet is completely secure.',
    },
    {
      title: '6. Policy changes',
      body: 'We may update this policy from time to time. The latest version will always be published on this page with a clear update date.',
    },
  ];

  return (
    <section className="pt-32 pb-20 bg-brand-white">
      <div className="container-base max-w-3xl">
        <h1 className="text-display-md font-semibold text-brand-black mb-3">{t('title')}</h1>
        <p className="text-sm text-brand-gray-400 mb-16">
          {t('updated')}: {isVI ? '01 tháng 3, 2025' : 'March 1, 2025'}
        </p>

        <p className="text-brand-gray-600 mb-12">
          {isVI
            ? 'Tại FrameX, sự rõ ràng không chỉ áp dụng trong cách chúng tôi làm công trình, mà còn trong cách chúng tôi tiếp nhận và sử dụng thông tin của bạn.'
            : 'At FrameX, clarity doesn\'t only apply to how we build — it extends to how we receive and use your information.'}
        </p>

        <article className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-semibold text-brand-black mb-3">{section.title}</h2>
              <p className="text-brand-gray-600 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}
