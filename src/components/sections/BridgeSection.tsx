import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function BridgeSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      className="py-24 md:py-32 bg-brand-gray-50 border-y border-brand-gray-100"
      aria-label="Bridge statement"
    >
      <div className="container-base">
        <blockquote className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl font-light text-brand-gray-700 leading-relaxed">
            {t('bridge')}
          </p>
          <footer className="mt-6">
            <span className="text-brand-gray-400 text-sm">— FrameX</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
