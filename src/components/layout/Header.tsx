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

/** FrameX wordmark — FRAME in charcoal, X in brand orange */
function FrameXLogo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="font-bold tracking-[0.06em] uppercase select-none"
      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.125rem' }}
      aria-label="FrameX"
    >
      <span style={{ color: dark ? '#2C2C2C' : '#FFFFFF' }}>FRAME</span>
      <span style={{ color: '#FF6B35' }}>X</span>
    </span>
  );
}

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeroZone, setIsHeroZone] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      setIsHeroZone(y < window.innerHeight * 0.75);
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

  /* Header is transparent+hidden in hero zone; appears on scroll */
  const headerVisible = isScrolled || !isHeroZone;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${isScrolled
            ? 'border-b shadow-sm'
            : 'border-b border-transparent'}
        `}
        style={{
          background: isScrolled
            ? 'rgba(249,248,246,0.97)'
            : 'transparent',
          borderBottomColor: isScrolled ? '#EBEBEB' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          opacity: headerVisible ? 1 : 0,
          pointerEvents: headerVisible ? 'auto' : 'none',
          transform: headerVisible ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease, background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div className="container-base">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">

            {/* ── Logo ── */}
            <Link href={`/${locale}`} aria-label="FrameX home">
              <FrameXLogo dark={isScrolled} />
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 relative group"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: isActive(link.href)
                      ? '#2C2C2C'
                      : isScrolled ? '#6B6B6B' : 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {link.label}
                  {/* Active underline */}
                  {isActive(link.href) && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{ background: '#FF6B35' }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right: lang switcher + CTA ── */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher locale={locale} />

              {/* CTA button — primary orange */}
              <Link
                href={p('/lien-he')}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-sm transition-all duration-200"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: '#FF6B35',
                  color: '#FFFFFF',
                  border: '2px solid #FF6B35',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = 'transparent';
                  el.style.color = isScrolled ? '#FF6B35' : '#FF6B35';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = '#FF6B35';
                  el.style.color = '#FFFFFF';
                }}
              >
                {t('cta')}
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 transition-colors"
                style={{ color: isScrolled ? '#4A4A4A' : 'rgba(255,255,255,0.7)' }}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-16 overflow-y-auto"
          style={{ background: 'rgba(249,248,246,0.98)', backdropFilter: 'blur(16px)' }}
          onClick={() => setMobileOpen(false)}
        >
          <nav className="container-base py-8 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b text-base font-medium"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  borderBottomColor: '#EBEBEB',
                  color: isActive(link.href) ? '#2C2C2C' : '#6B6B6B',
                }}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#FF6B35' }}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
            <Link
              href={p('/lien-he')}
              onClick={() => setMobileOpen(false)}
              className="mt-6 py-3.5 text-center text-xs font-semibold rounded-sm"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: '#FF6B35',
                color: '#FFFFFF',
              }}
            >
              {t('cta')}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
