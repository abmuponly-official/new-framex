import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';
import Link from 'next/link';
import { getSiteSettings, getSetting } from '@/lib/supabase/settings';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: {
      canonical: `/${locale}/ve-chung-toi`,
      languages: { vi: '/vi/ve-chung-toi', en: '/en/ve-chung-toi' },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t  = await getTranslations({ locale, namespace: 'about' });
  const tf = await getTranslations({ locale, namespace: 'footer' });

  const settings  = await getSiteSettings();
  const ytUrl     = getSetting(settings, 'youtube_url',    locale);
  const waUrl     = getSetting(settings, 'warehouse_url',  locale);
  const pinUrl    = getSetting(settings, 'pinterest_url',  locale);
  const pdfPath   = getSetting(settings, 'capability_pdf', locale);

  const p = (path: string) => `/${locale}${path}`;

  /* ── Icon SVGs (inline, no external dep) ────────────────────────────── */
  const IconYT = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.47A3.01 3.01 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.47a3.01 3.01 0 0 0 2.12-2.13A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.52V8.48L15.86 12l-6.11 3.52z"/>
    </svg>
  );
  const IconWH = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  );
  const IconPin = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.18-.11-.94-.2-2.38.04-3.4.22-.92 1.47-6.22 1.47-6.22s-.37-.75-.37-1.86c0-1.74 1.01-3.05 2.27-3.05 1.07 0 1.59.8 1.59 1.77 0 1.08-.69 2.69-1.05 4.19-.3 1.25.62 2.27 1.85 2.27 2.22 0 3.71-2.86 3.71-6.25 0-2.57-1.73-4.37-4.21-4.37-2.87 0-4.55 2.15-4.55 4.37 0 .87.33 1.8.75 2.3a.3.3 0 0 1 .07.29c-.08.31-.25 1-.28 1.14-.04.18-.14.22-.32.13-1.25-.58-2.03-2.42-2.03-3.89 0-3.16 2.3-6.07 6.63-6.07 3.48 0 6.19 2.48 6.19 5.8 0 3.46-2.18 6.24-5.2 6.24-1.02 0-1.97-.53-2.3-1.15l-.62 2.33c-.23.87-.84 1.96-1.25 2.62.94.29 1.94.45 2.97.45 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  );

  const socials = [
    { key: 'yt',  href: ytUrl,  label: 'YouTube',       icon: IconYT  },
    { key: 'wh',  href: waUrl,  label: '3D Warehouse',  icon: IconWH  },
    { key: 'pin', href: pinUrl, label: 'Pinterest',      icon: IconPin },
  ].filter(s => s.href);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        className="pt-32 pb-20"
      >
        <div className="container-base max-w-3xl">
          <p
            className="text-xs uppercase tracking-[0.18em] mb-5 font-semibold"
            style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}
          >
            {t('s1_label')}
          </p>
          <h1
            className="mb-6 font-semibold leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('headline')}
          </h1>
          <p
            className="text-lg leading-relaxed mb-4"
            style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '56ch', fontFamily: 'Inter, sans-serif' }}
          >
            {t('sub')}
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '64ch', fontFamily: 'Inter, sans-serif' }}
          >
            {t('mission')}
          </p>
        </div>
      </section>

      {/* ── Section 1: Where we started ───────────────────────────── */}
      <section className="section-padding bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-3 font-semibold">
            01 · {t('s1_label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-black mb-6">
            {t('s1_title')}
          </h2>
          <p className="text-base text-brand-gray-600 leading-relaxed max-w-2xl">
            {t('s1_body')}
          </p>
        </div>
      </section>

      {/* ── Section 2: What we do ──────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#F9F9F9' }}>
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-3 font-semibold">
            02 · {t('s2_label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-black mb-6">
            {t('s2_title')}
          </h2>
          <p className="text-base text-brand-gray-600 leading-relaxed mb-10 max-w-2xl">
            {t('s2_body')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { num: '01', key: 's2_p1' },
              { num: '02', key: 's2_p2' },
              { num: '03', key: 's2_p3' },
            ] as const).map(({ num, key }) => (
              <div
                key={num}
                className="p-6 bg-brand-white border border-brand-gray-100 rounded-sm"
              >
                <p
                  className="text-xs font-bold mb-2 tracking-[0.12em]"
                  style={{ color: '#FF6B35' }}
                >
                  {num}
                </p>
                <p className="font-semibold text-brand-black text-sm leading-snug">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: How we do it ────────────────────────────────── */}
      <section className="section-padding bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-3 font-semibold">
            03 · {t('s3_label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-black mb-10">
            {t('s3_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              { ctitle: 's3_c1_title', cbody: 's3_c1_body' },
              { ctitle: 's3_c2_title', cbody: 's3_c2_body' },
              { ctitle: 's3_c3_title', cbody: 's3_c3_body' },
            ] as const).map(({ ctitle, cbody }, i) => (
              <div key={i}>
                <div
                  className="w-6 h-px mb-4"
                  style={{ background: '#FF6B35' }}
                />
                <h3 className="font-semibold text-brand-black text-base mb-2">
                  {t(ctitle)}
                </h3>
                <p className="text-sm text-brand-gray-500 leading-relaxed">
                  {t(cbody)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Who we work with ───────────────────────────── */}
      <section className="section-padding" style={{ background: '#F9F9F9' }}>
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-3 font-semibold">
            04 · {t('s4_label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-black mb-10">
            {t('s4_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { role: 's4_inv', body: 's4_inv_body', href: p('/chu-dau-tu') },
              { role: 's4_con', body: 's4_con_body', href: p('/nha-thau') },
              { role: 's4_arc', body: 's4_arc_body', href: p('/kien-truc-su') },
            ] as const).map(({ role, body, href }) => (
              <Link
                key={role}
                href={href}
                className="block p-6 bg-brand-white border border-brand-gray-100 rounded-sm
                  hover:border-brand-gray-300 transition-colors group"
              >
                <h3 className="font-semibold text-brand-black text-base mb-2 group-hover:text-[#FF6B35] transition-colors">
                  {t(role)}
                </h3>
                <p className="text-sm text-brand-gray-500 leading-relaxed">
                  {t(body)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: What we believe ────────────────────────────── */}
      <section className="section-padding bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-3 font-semibold">
            05 · {t('s5_label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-black mb-4">
            {t('s5_title')}
          </h2>
          <p className="text-base text-brand-gray-600 leading-relaxed mb-10 max-w-2xl">
            {t('s5_body')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              { ctitle: 's5_c1_title', cbody: 's5_c1_body' },
              { ctitle: 's5_c2_title', cbody: 's5_c2_body' },
              { ctitle: 's5_c3_title', cbody: 's5_c3_body' },
            ] as const).map(({ ctitle, cbody }, i) => (
              <div key={i} className="p-6 border border-brand-gray-100 rounded-sm">
                <div className="w-6 h-px bg-brand-accent mb-4" />
                <h3 className="font-semibold text-brand-black text-base mb-2">
                  {t(ctitle)}
                </h3>
                <p className="text-sm text-brand-gray-500 leading-relaxed">
                  {t(cbody)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social links ─────────────────────────────────────────── */}
      {socials.length > 0 && (
        <section
          className="py-14 border-b border-brand-gray-100"
          style={{ background: '#F9F9F9' }}
        >
          <div className="container-base max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-gray-400 mb-6 font-semibold">
              {t('social_title')}
            </p>
            <div className="flex flex-wrap gap-4">
              {socials.map(({ key, href, label, icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium
                    text-brand-black border border-brand-gray-200 rounded-sm
                    hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section
        className="section-padding"
        style={{ background: '#111111' }}
      >
        <div className="container-base max-w-3xl">
          <p
            className="text-xs uppercase tracking-[0.18em] mb-5 font-semibold"
            style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}
          >
            {t('cta_label')}
          </p>
          <h2
            className="mb-4 font-semibold"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('cta_title')}
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '56ch', fontFamily: 'Inter, sans-serif' }}
          >
            {t('cta_body')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={p('/lien-he')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-colors"
              style={{ background: '#FF6B35', color: '#FFFFFF' }}
            >
              {t('cta_btn')} →
            </Link>
            {pdfPath && (
              <a
                href={pdfPath}
                download
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm transition-colors"
                style={{
                  color: '#FF6B35',
                  border: '1px solid rgba(255,107,53,0.4)',
                }}
              >
                ↓ {tf('capability')}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
