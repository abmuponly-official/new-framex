import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';
import { getSiteSettings, getSetting } from '@/lib/supabase/settings';

type Props = { locale: Locale };

export default async function Footer({ locale }: Props) {
  const t   = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const year = new Date().getFullYear();

  /* ── Contact info from CMS (unchanged) ──────────────────────────────────── */
  const settings = await getSiteSettings();
  const email   = getSetting(settings, 'contact_email',  locale);
  const phone   = getSetting(settings, 'contact_phone',  locale);
  const address = getSetting(settings, 'address',        locale);
  const pdfPath = getSetting(settings, 'capability_pdf', locale);

  const p = (path: string) => `/${locale}${path}`;

  return (
    <footer
      aria-label="Site footer"
      style={{ background: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Inline hover styles via <style> — avoids client event handlers */}
      <style>{`
        .footer-nav-link { color: rgba(255,255,255,0.45); transition: color 0.2s; font-family: Inter, sans-serif; font-size: 0.875rem; display: block; }
        .footer-nav-link:hover { color: rgba(255,255,255,0.85); }
        .footer-legal-link { color: rgba(255,255,255,0.28); transition: color 0.2s; font-family: Inter, sans-serif; font-size: 0.75rem; }
        .footer-legal-link:hover { color: rgba(255,255,255,0.6); }
        .footer-contact-link { color: rgba(255,255,255,0.45); transition: color 0.2s; font-family: Inter, sans-serif; font-size: 0.875rem; }
        .footer-contact-link:hover { color: rgba(255,255,255,0.85); }
        .footer-pdf-btn { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; font-size: 0.75rem; font-weight: 600; padding: 0.5rem 0.75rem; color: #FF6B35; border: 1px solid rgba(255,107,53,0.35); border-radius: 2px; font-family: Inter, sans-serif; letter-spacing: 0.04em; transition: background 0.2s, border-color 0.2s; }
        .footer-pdf-btn:hover { background: rgba(255,107,53,0.08); border-color: rgba(255,107,53,0.6); }
      `}</style>

      <div className="container-base py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ── Col 1: Brand ── */}
          <div className="lg:col-span-1">
            {/* Logo wordmark */}
            <p
              className="font-bold tracking-[0.06em] uppercase mb-4 text-lg"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span style={{ color: '#FFFFFF' }}>FRAME</span>
              <span style={{ color: '#FF6B35' }}>X</span>
            </p>
            {/* Tagline */}
            <p
              className="text-xs tracking-[0.12em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}
            >
              Shaping Tomorrow&apos;s Living
            </p>
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', maxWidth: '28ch' }}
            >
              {t('tagline')}
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.3)', lineHeight: '1.6', maxWidth: '30ch' }}
            >
              {t('sub')}
            </p>
          </div>

          {/* ── Col 2: Navigation ── */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.14em] mb-5 font-semibold"
              style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}
            >
              {t('nav_title')}
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: p('/giai-phap-3-trong-1'), label: nav('solution')   },
                { href: p('/chu-dau-tu'),           label: nav('investor')   },
                { href: p('/nha-thau'),             label: nav('contractor') },
                { href: p('/kien-truc-su'),         label: nav('architect')  },
                { href: p('/du-an'),                label: nav('projects')   },
                { href: p('/tin-tuc'),              label: nav('blog')       },
                { href: p('/lien-he'),              label: nav('contact')    },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Col 3: Trust signals ── */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.14em] mb-5 font-semibold"
              style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}
            >
              {t('trust_title')}
            </p>
            <ul className="flex flex-col gap-3">
              {[t('trust_1'), t('trust_2'), t('trust_3'), t('trust_4'), t('trust_5')].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 shrink-0 rounded-full"
                    style={{ width: '5px', height: '5px', background: '#FF6B35', opacity: 0.7 }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact (CMS) ── */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.14em] mb-5 font-semibold"
              style={{ color: '#FF6B35', fontFamily: 'Inter, sans-serif' }}
            >
              {t('contact_title')}
            </p>
            <address
              className="not-italic flex flex-col gap-3 text-sm"
              style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}
            >
              {email && (
                <a href={`mailto:${email}`} className="footer-contact-link">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="footer-contact-link">
                  {phone}
                </a>
              )}
              {address && (
                <span style={{ lineHeight: '1.6' }}>{address}</span>
              )}
            </address>

            {/* Capability PDF */}
            {pdfPath && (
              <a href={pdfPath} download className="footer-pdf-btn">
                ↓ {t('capability')}
              </a>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-16 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em' }}
          >
            {t('copyright', { year })} &nbsp;·&nbsp; {t('slogan')}
          </p>
          <nav className="flex flex-wrap items-center gap-5" aria-label="Legal links">
            {[
              { href: p('/ve-chung-toi'),         label: nav('about') },
              { href: p('/chinh-sach-bao-mat'),   label: t('privacy') },
              { href: p('/dieu-khoan-su-dung'),   label: t('terms') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="footer-legal-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
