'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import type { Locale } from '@/lib/i18n/request';
import LanguageSwitcher from './LanguageSwitcher';

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeroZone, setIsHeroZone] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsHeroZone(window.scrollY < window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const p = (path: string) => `/${locale}${path}`;

  const navLinks = [
    { href: p('/giai-phap-3-trong-1'), label: t('solution') },
    { href: p('/chu-dau-tu'),          label: t('investor') },
    { href: p('/nha-thau'),            label: t('contractor') },
    { href: p('/kien-truc-su'),        label: t('architect') },
    { href: p('/du-an'),               label: t('projects') },
    { href: p('/tin-tuc'),             label: t('blog') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${isScrolled
            ? 'bg-brand-white/95 backdrop-blur-sm border-b border-brand-gray-100 shadow-sm'
            : 'bg-transparent'}
          ${isHeroZone && !isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        `}
      >
        <div className="container-base">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="font-semibold text-lg tracking-tight text-brand-black hover:opacity-70 transition-opacity"
            >
              FrameX
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm font-medium transition-colors
                    ${isActive(link.href)
                      ? 'text-brand-black'
                      : 'text-brand-gray-500 hover:text-brand-black'}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher locale={locale} />

              {/* Desktop CTA */}
              <Link
                href={p('/lien-he')}
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium
                  bg-brand-black text-brand-white rounded-sm
                  hover:bg-brand-gray-800 transition-colors"
              >
                {t('cta')}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-brand-gray-600 hover:text-brand-black transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-white pt-16"
          onClick={() => setMobileOpen(false)}
        >
          <nav className="container-base py-8 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  py-3 text-lg font-medium border-b border-brand-gray-100
                  ${isActive(link.href) ? 'text-brand-black' : 'text-brand-gray-600'}
                `}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={p('/lien-he')}
              onClick={() => setMobileOpen(false)}
              className="mt-6 py-3 px-6 text-center text-sm font-medium
                bg-brand-black text-brand-white rounded-sm"
            >
              {t('cta')}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
