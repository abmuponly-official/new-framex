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
        <div className="max-w-3xl mx-auto text-center">
          {/* Primary quote */}
          <blockquote>
            <p className="text-xl md:text-2xl font-light text-brand-gray-700 leading-relaxed">
              {t('bridge')}
            </p>
            <footer className="mt-4">
              <span className="text-brand-gray-400 text-sm">— FrameX</span>
            </footer>
          </blockquote>

          {/* Supporting paragraph */}
          <p className="mt-8 text-base text-brand-gray-500 leading-relaxed max-w-2xl mx-auto">
            {t('bridge_sub')}
          </p>
        </div>
      </div>
    </section>
  );
}
