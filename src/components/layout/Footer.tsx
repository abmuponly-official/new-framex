import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/i18n/request';

type Props = { locale: Locale };

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const nav = await getTranslations({ locale, namespace: 'nav' });
  const year = new Date().getFullYear();

  const p = (path: string) => `/${locale}${path}`;

  return (
    <footer className="bg-brand-black text-brand-white" aria-label="Site footer">
      <div className="container-base py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <p className="font-semibold text-lg tracking-tight mb-3">FrameX</p>
            <p className="text-brand-gray-300 text-sm leading-relaxed mb-1">
              {t('tagline')}
            </p>
            <p className="text-brand-gray-500 text-xs">
              {t('sub')}
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="text-brand-gray-400 text-xs uppercase tracking-widest mb-4 font-medium">
              {t('nav_title')}
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: p('/giai-phap-3-trong-1'), label: nav('solution') },
                { href: p('/chu-dau-tu'),          label: nav('investor') },
                { href: p('/nha-thau'),            label: nav('contractor') },
                { href: p('/kien-truc-su'),        label: nav('architect') },
                { href: p('/du-an'),               label: nav('projects') },
                { href: p('/tin-tuc'),             label: nav('blog') },
                { href: p('/lien-he'),             label: nav('contact') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-gray-300 hover:text-brand-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Trust signals */}
          <div>
            <p className="text-brand-gray-400 text-xs uppercase tracking-widest mb-4 font-medium">
              {t('trust_title')}
            </p>
            <ul className="flex flex-col gap-2.5">
              {[
                t('trust_1'),
                t('trust_2'),
                t('trust_3'),
                t('trust_4'),
                t('trust_5'),
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p className="text-brand-gray-400 text-xs uppercase tracking-widest mb-4 font-medium">
              {t('contact_title')}
            </p>
            <address className="not-italic flex flex-col gap-2.5 text-sm text-brand-gray-300">
              <a href="mailto:hello@framex.vn" className="hover:text-brand-white transition-colors">
                hello@framex.vn
              </a>
              <a href="tel:+84" className="hover:text-brand-white transition-colors">
                +84 xxx xxx xxx
              </a>
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </address>

            {/* Capability PDF download */}
            <a
              href="/files/framex-capability.pdf"
              download
              className="inline-flex items-center gap-2 mt-6 text-xs text-brand-accent
                border border-brand-accent/40 rounded-sm px-3 py-2
                hover:bg-brand-accent/10 transition-colors"
            >
              ↓ {t('capability')}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-brand-gray-700 flex flex-col md:flex-row
          items-start md:items-center justify-between gap-4">
          <p className="text-brand-gray-500 text-xs">
            {t('copyright', { year })} &nbsp;·&nbsp; {t('slogan')}
          </p>
          <nav className="flex flex-wrap items-center gap-4 text-xs text-brand-gray-500" aria-label="Legal links">
            <Link href={p('/ve-chung-toi')} className="hover:text-brand-gray-300 transition-colors">
              {nav('about')}
            </Link>
            <Link href={p('/chinh-sach-bao-mat')} className="hover:text-brand-gray-300 transition-colors">
              {t('privacy')}
            </Link>
            <Link href={p('/dieu-khoan-su-dung')} className="hover:text-brand-gray-300 transition-colors">
              {t('terms')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
