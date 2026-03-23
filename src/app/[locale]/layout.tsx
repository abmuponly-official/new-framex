import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/request';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import RouteChangeHandler from '@/components/ui/RouteChangeHandler';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: {
      template: '%s | FrameX',
      default:
        locale === 'vi'
          ? 'FrameX — Giải pháp 3-trong-1 cho phần khung và vỏ công trình'
          : 'FrameX — 3-in-1 Solution for Building Frame & Envelope',
    },
    description:
      locale === 'vi'
        ? 'FrameX tích hợp kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện trong một đơn vị thực hiện duy nhất.'
        : 'FrameX integrates pre-engineered steel, high-performance insulation and comprehensive waterproofing under one executing entity.',
    alternates: {
      canonical: locale === 'vi' ? '/vi' : '/en',
      languages: {
        vi: '/vi',
        en: '/en',
      },
    },
    openGraph: {
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
      type: 'website',
      siteName: 'FrameX',
      images: [{ url: 'https://framex.vn/images/og-default.png', width: 1200, height: 630, alt: 'FrameX' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@framexvn',
    },
    metadataBase: new URL('https://framex.vn'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = params.locale as Locale;

  if (!locales.includes(locale)) notFound();

  // Enable static rendering for all locales
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Montserrat — display headings | Inter — body copy
            display=swap prevents invisible text during font load (FOIT) */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-brand-white text-brand-black font-sans antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <NextIntlClientProvider messages={messages}>
          {/* Skip-to-content for keyboard / AT users */}
          <a href="#main-content" className="skip-to-content">
            {locale === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
          </a>
          <Header locale={locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale} />
          <ScrollReveal />
          <RouteChangeHandler />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
