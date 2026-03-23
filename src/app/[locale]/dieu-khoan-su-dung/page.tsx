import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('title'),
    alternates: {
      canonical: `/${locale}/dieu-khoan-su-dung`,
      languages: { vi: '/vi/dieu-khoan-su-dung', en: '/en/dieu-khoan-su-dung' },
    },
    openGraph: {
      title: t('title'),
      url: `https://framex.vn/${locale}/dieu-khoan-su-dung`,
      images: [{ url: 'https://framex.vn/images/og-default.png', width: 1200, height: 630, alt: 'FrameX' }],
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  const isVI = locale === 'vi';

  const sections = isVI ? [
    {
      title: '1. Chấp nhận điều khoản',
      body: 'Bằng việc truy cập hoặc sử dụng website framex.vn, bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.',
    },
    {
      title: '2. Mục đích của website',
      body: 'Website này được vận hành nhằm cung cấp thông tin tham khảo về giải pháp và kết nối hợp tác. Mọi thông tin đăng tải chỉ mang tính tham khảo và không thay thế cho khảo sát thực tế hay tư vấn kỹ thuật chuyên sâu.',
    },
    {
      title: '3. Về báo giá và cam kết',
      body: 'Mọi báo giá, đề xuất hoặc cam kết về chi phí, tiến độ và phạm vi công việc chỉ có giá trị ràng buộc khi được FrameX xác nhận bằng văn bản chính thức, dựa trên hồ sơ thực tế của dự án. Thông tin trên website không được coi là báo giá chính thức.',
    },
    {
      title: '4. Sở hữu trí tuệ',
      body: 'Toàn bộ nội dung trên website này — bao gồm văn bản, hình ảnh, đồ họa, thiết kế và nhãn hiệu — là tài sản của FrameX hoặc được sử dụng theo giấy phép hợp lệ. Nghiêm cấm sao chép, phân phối hoặc sử dụng thương mại khi chưa có sự đồng ý bằng văn bản.',
    },
    {
      title: '5. Giới hạn trách nhiệm',
      body: 'FrameX không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng thông tin trên website này.',
    },
    {
      title: '6. Luật áp dụng',
      body: 'Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.',
    },
    {
      title: '7. Thay đổi điều khoản',
      body: 'FrameX có quyền cập nhật các điều khoản này. Phiên bản hiện hành luôn được đăng tải trên trang này.',
    },
  ] : [
    {
      title: '1. Acceptance',
      body: 'By accessing or using framex.vn, you agree to these terms. If you disagree, please stop using the website.',
    },
    {
      title: '2. Purpose of the website',
      body: 'This website provides reference information about solutions and facilitates business connections. All published information is for reference only and does not substitute for actual site surveys or specialized technical consultation.',
    },
    {
      title: '3. Quotes and commitments',
      body: 'Any quotation, proposal or commitment regarding cost, schedule and scope of work is only binding when confirmed in writing by FrameX, based on actual project documentation. Information on the website does not constitute an official quote.',
    },
    {
      title: '4. Intellectual property',
      body: 'All content on this website — including text, images, graphics, design and trademarks — is the property of FrameX or used under valid license. Reproduction, distribution or commercial use without written consent is strictly prohibited.',
    },
    {
      title: '5. Limitation of liability',
      body: 'FrameX is not liable for any indirect, incidental or consequential damages arising from the use of or inability to use information on this website.',
    },
    {
      title: '6. Governing law',
      body: 'These terms are governed by the laws of Vietnam. Any disputes will be resolved in the competent courts of Ho Chi Minh City, Vietnam.',
    },
    {
      title: '7. Changes to terms',
      body: 'FrameX reserves the right to update these terms. The current version is always published on this page.',
    },
  ];

  return (
    <section className="pt-32 pb-20 bg-brand-white">
      <div className="container-base max-w-3xl">
        <h1 className="text-display-md font-semibold text-brand-black mb-3">{t('title')}</h1>
        <p className="text-sm text-brand-gray-400 mb-16">
          {t('updated')}: {isVI ? '01 tháng 3, 2025' : 'March 1, 2025'}
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
