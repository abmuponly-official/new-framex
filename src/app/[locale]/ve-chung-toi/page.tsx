import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('headline'), description: t('sub') };
}

export default async function AboutPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const isVI = locale === 'vi';

  return (
    <>
      <section className="pt-32 pb-20 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <h1 className="text-display-lg font-semibold text-brand-black mb-4">{t('headline')}</h1>
          <p className="text-lg text-brand-gray-500 max-w-xl">{t('sub')}</p>
        </div>
      </section>

      <section className="section-padding bg-brand-white">
        <div className="container-base max-w-3xl">
          <p className="text-lg text-brand-gray-700 leading-relaxed mb-12">{t('mission')}</p>

          {/* Core values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: isVI ? 'Trung thực trong cam kết' : 'Honest commitments',
                desc:  isVI
                  ? 'Chúng tôi không hứa những gì chúng tôi không thể kiểm soát.'
                  : 'We don\'t promise what we can\'t control.',
              },
              {
                title: isVI ? 'Rõ ràng trong chi phí' : 'Clear in cost',
                desc:  isVI
                  ? 'CO được phát hành trước thi công. Không có phát sinh mập mờ.'
                  : 'Change orders are issued before work begins. No ambiguous extras.',
              },
              {
                title: isVI ? 'Đồng hành suốt vòng đời' : 'With you throughout',
                desc:  isVI
                  ? 'Từ bản vẽ đầu tiên đến nghiệm thu cuối cùng — 1 đầu mối duy nhất.'
                  : 'From first drawing to final handover — one single contact.',
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-brand-gray-100 rounded-sm">
                <div className="w-6 h-px bg-brand-accent mb-4" />
                <h2 className="font-semibold text-brand-black mb-2 text-base">{item.title}</h2>
                <p className="text-sm text-brand-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
