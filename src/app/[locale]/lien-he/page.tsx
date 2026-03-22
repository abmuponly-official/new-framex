import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';
import ContactForm from '@/components/sections/ContactForm';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('headline'), description: t('sub') };
}

export default async function ContactPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      <section className="pt-32 pb-16 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <h1 className="text-display-lg font-semibold text-brand-black mb-4">{t('headline')}</h1>
          <p className="text-lg text-brand-gray-500">{t('sub')}</p>
        </div>
      </section>

      <section className="section-padding bg-brand-white">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact form */}
            <ContactForm locale={locale} />

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
                  {locale === 'vi' ? 'Liên hệ trực tiếp' : 'Direct contact'}
                </p>
                <address className="not-italic space-y-3 text-brand-gray-600">
                  <p><a href="mailto:hello@framex.vn" className="hover:text-brand-black transition-colors">hello@framex.vn</a></p>
                  <p><a href="tel:+84" className="hover:text-brand-black transition-colors">+84 xxx xxx xxx</a></p>
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </address>
              </div>

              <div className="p-6 bg-brand-gray-50 rounded-sm">
                <p className="text-sm font-medium text-brand-black mb-3">
                  {locale === 'vi' ? 'Tốc độ phản hồi' : 'Response time'}
                </p>
                <p className="text-sm text-brand-gray-500">
                  {locale === 'vi'
                    ? 'Chúng tôi phản hồi trong 1 ngày làm việc.'
                    : 'We respond within 1 business day.'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
                  {locale === 'vi' ? 'Tải hồ sơ năng lực' : 'Capability profile'}
                </p>
                <a
                  href="/files/framex-capability.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm text-brand-black
                    border border-brand-gray-200 rounded-sm px-4 py-2.5
                    hover:bg-brand-gray-50 transition-colors"
                >
                  ↓ {locale === 'vi' ? 'Tải PDF' : 'Download PDF'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
