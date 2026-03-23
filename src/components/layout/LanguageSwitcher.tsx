'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/lib/i18n/request';

type Props = {
  locale: Locale;
  dark?: boolean; // true when header has light background (scrolled)
};

export default function LanguageSwitcher({ locale, dark = false }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === 'vi' ? 'en' : 'vi';

  function switchLocale() {
    // Replace only the leading /vi or /en prefix — not any later path segment
    const newPath = pathname.replace(new RegExp(`^/${locale}(/|$)`), `/${otherLocale}$1`);

    // Persist preference in cookie (1 year)
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

    startTransition(() => {
      router.push(newPath);
    });
  }

  const baseColor    = dark ? 'rgba(44,44,44,0.65)'    : 'rgba(255,255,255,0.6)';
  const baseBorder   = dark ? 'rgba(44,44,44,0.2)'     : 'rgba(255,255,255,0.2)';
  const hoverColor   = '#FF6B35';
  const hoverBorder  = 'rgba(255,107,53,0.5)';

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      aria-label={`Switch to ${otherLocale === 'vi' ? 'Tiếng Việt' : 'English'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '0.06em',
        padding: '0.25rem 0.55rem',
        borderRadius: '2px',
        border: `1px solid ${baseBorder}`,
        color: baseColor,
        background: 'transparent',
        transition: 'color 0.2s, border-color 0.2s',
        opacity: isPending ? 0.5 : 1,
        cursor: isPending ? 'wait' : 'pointer',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.color       = hoverColor;
        btn.style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.color       = baseColor;
        btn.style.borderColor = baseBorder;
      }}
    >
      {/* Current locale — dimmed; target locale — full opacity */}
      <span style={{ opacity: 0.4 }}>{locale.toUpperCase()}</span>
      <span style={{ opacity: 0.25, margin: '0 1px' }}>·</span>
      <span>{otherLocale.toUpperCase()}</span>
    </button>
  );
}
