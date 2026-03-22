import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/request';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-brand-white text-brand-black font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main id="main-content">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
