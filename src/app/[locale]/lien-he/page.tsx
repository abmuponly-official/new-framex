import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';
import ContactForm from '@/components/sections/ContactForm';
import { getSiteSettings, getSetting } from '@/lib/supabase/settings';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('headline'), description: t('sub') };
}

/* ── Icon helpers (inline SVG — no external dep) ─────────────────────────── */
function IconYT() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.54 3.6 12 3.6 12 3.6s-7.54 0-9.38.47A3.01 3.01 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13C4.46 20.4 12 20.4 12 20.4s7.54 0 9.38-.47a3.01 3.01 0 0 0 2.12-2.13A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.52V8.48L15.86 12l-6.11 3.52z"/>
    </svg>
  );
}
function IconWH() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.18-.11-.94-.2-2.38.04-3.4.22-.92 1.47-6.22 1.47-6.22s-.37-.75-.37-1.86c0-1.74 1.01-3.05 2.27-3.05 1.07 0 1.59.8 1.59 1.77 0 1.08-.69 2.69-1.05 4.19-.3 1.25.62 2.27 1.85 2.27 2.22 0 3.71-2.86 3.71-6.25 0-2.57-1.73-4.37-4.21-4.37-2.87 0-4.55 2.15-4.55 4.37 0 .87.33 1.8.75 2.3a.3.3 0 0 1 .07.29c-.08.31-.25 1-.28 1.14-.04.18-.14.22-.32.13-1.25-.58-2.03-2.42-2.03-3.89 0-3.16 2.3-6.07 6.63-6.07 3.48 0 6.19 2.48 6.19 5.8 0 3.46-2.18 6.24-5.2 6.24-1.02 0-1.97-.53-2.3-1.15l-.62 2.33c-.23.87-.84 1.96-1.25 2.62.94.29 1.94.45 2.97.45 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
    </svg>
  );
}

export default async function ContactPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  // ── Fetch contact info from CMS (cached 60 s) ──────────────────────────────
  const settings  = await getSiteSettings();
  const email     = getSetting(settings, 'contact_email',  locale);
  const phone     = getSetting(settings, 'contact_phone',  locale);
  const address   = getSetting(settings, 'address',        locale);
  const pdfPath   = getSetting(settings, 'capability_pdf', locale);
  const ytUrl     = getSetting(settings, 'youtube_url',    locale);
  const waUrl     = getSetting(settings, 'warehouse_url',  locale);
  const pinUrl    = getSetting(settings, 'pinterest_url',  locale);

  const isVI = locale === 'vi';

  const socials = [
    { key: 'yt',  href: ytUrl,  label: 'YouTube',      Icon: IconYT  },
    { key: 'wh',  href: waUrl,  label: '3D Warehouse', Icon: IconWH  },
    { key: 'pin', href: pinUrl, label: 'Pinterest',     Icon: IconPin },
  ].filter(s => s.href);

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

            {/* Contact info — driven by CMS */}
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
                  {isVI ? 'Liên hệ trực tiếp' : 'Direct contact'}
                </p>
                <address className="not-italic space-y-3 text-brand-gray-600">
                  {email && (
                    <p>
                      <a href={`mailto:${email}`} className="hover:text-brand-black transition-colors">
                        {email}
                      </a>
                    </p>
                  )}
                  {phone && (
                    <p>
                      <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        className="hover:text-brand-black transition-colors"
                      >
                        {phone}
                      </a>
                    </p>
                  )}
                  {address && <p>{address}</p>}
                </address>
              </div>

              <div className="p-6 bg-brand-gray-50 rounded-sm">
                <p className="text-sm font-medium text-brand-black mb-3">
                  {isVI ? 'Tốc độ phản hồi' : 'Response time'}
                </p>
                <p className="text-sm text-brand-gray-500">
                  {isVI
                    ? 'Chúng tôi phản hồi trong 1 ngày làm việc.'
                    : 'We respond within 1 business day.'}
                </p>
              </div>

              {/* ── Download brochure ─────────────────────────────────── */}
              {pdfPath && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
                    {isVI ? 'Tải hồ sơ năng lực' : 'Capability profile'}
                  </p>
                  <a
                    href={pdfPath}
                    download
                    className="inline-flex items-center gap-2 text-sm text-brand-black
                      border border-brand-gray-200 rounded-sm px-4 py-2.5
                      hover:bg-brand-gray-50 transition-colors"
                  >
                    ↓ {isVI ? 'Tải PDF' : 'Download PDF'}
                  </a>
                </div>
              )}

              {/* ── Social links (below brochure) ─────────────────────── */}
              {socials.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
                    {isVI ? 'Theo dõi FrameX' : 'Follow FrameX'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {socials.map(({ key, href, label, Icon }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-brand-gray-600
                          border border-brand-gray-200 rounded-sm px-4 py-2.5
                          hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                        aria-label={label}
                      >
                        <Icon />
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
