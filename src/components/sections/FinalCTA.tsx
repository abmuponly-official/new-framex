import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function FinalCTA({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section
      className="section-padding"
      aria-labelledby="final-cta-heading"
      style={{ background: '#1A1A1A' }}
    >
      <div className="container-base">
        <div className="max-w-2xl mx-auto text-center">

          {/* Orange accent line */}
          <div className="flex justify-center mb-8 reveal">
            <span className="divider-accent" aria-hidden="true" />
          </div>

          <h2
            id="final-cta-heading"
            className="font-display font-bold text-balance mb-4 reveal reveal-delay-1"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            {t('final_headline')}
          </h2>
          <p
            className="text-base mb-10 reveal reveal-delay-2"
            style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', maxWidth: '52ch', margin: '0 auto 2.5rem' }}
          >
            {t('final_sub')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal reveal-delay-2">
            <Link href={`/${locale}/lien-he`} className="btn-primary min-w-[160px]">
              {t('final_cta_1')}
            </Link>
            <Link href={`/${locale}/lien-he?type=rfq`} className="btn-outline-white min-w-[160px]">
              {t('final_cta_2')}
            </Link>
          </div>

          {/* Microcopy */}
          <p
            className="mt-5 text-xs reveal reveal-delay-3"
            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.02em' }}
          >
            {t('final_microcopy')}
          </p>

          {/* Footer micro bullets */}
          <div
            className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 reveal reveal-delay-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[t('final_footer_1'), t('final_footer_2'), t('final_footer_3')].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span className="hidden md:inline" style={{ color: 'rgba(255,107,53,0.3)' }}>·</span>}
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
