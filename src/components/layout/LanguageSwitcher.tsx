'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/lib/i18n/request';

type Props = {
  locale: Locale;
};

export default function LanguageSwitcher({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale: Locale = locale === 'vi' ? 'en' : 'vi';

  function switchLocale() {
    // Replace /vi/... or /en/... prefix
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

    // Set cookie so middleware remembers preference
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="text-sm font-medium text-brand-gray-500 hover:text-brand-black transition-colors
        border border-brand-gray-200 rounded-sm px-2.5 py-1
        disabled:opacity-50"
      aria-label={`Switch to ${otherLocale === 'vi' ? 'Tiếng Việt' : 'English'}`}
    >
      {otherLocale === 'vi' ? 'VI' : 'EN'}
    </button>
  );
}
