import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/request';
import JsonLd from '@/components/seo/JsonLd';
import HeroSection from '@/components/sections/HeroSection';
import GuidedQuestion from '@/components/sections/GuidedQuestion';
import BridgeSection from '@/components/sections/BridgeSection';
import PainSection from '@/components/sections/PainSection';
import SolutionSection from '@/components/sections/SolutionSection';
import AudienceSection from '@/components/sections/AudienceSection';
import ProjectsPreview from '@/components/sections/ProjectsPreview';
import TrustSection from '@/components/sections/TrustSection';
import FinalCTA from '@/components/sections/FinalCTA';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const isVI = locale === 'vi';
  return {
    title: isVI
      ? 'FrameX — Giải pháp 3-trong-1 cho phần khung và vỏ công trình'
      : 'FrameX — 3-in-1 Solution for Building Frame & Envelope',
    description: isVI
      ? 'FrameX tích hợp kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện. 1 đầu mối, 1 tiến độ, 1 bộ bản vẽ đồng bộ.'
      : 'FrameX integrates pre-engineered steel, high-performance insulation and comprehensive waterproofing. 1 contact, 1 schedule, 1 synchronized drawing set.',
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: '/vi', en: '/en' },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FrameX',
    description:
      'Giải pháp 3-trong-1 cho phần khung và vỏ công trình: kết cấu thép tiền chế, cách nhiệt hiệu suất cao và chống thấm toàn diện.',
    url: 'https://framex.vn',
    logo: {
      '@type': 'ImageObject',
      url: 'https://framex.vn/images/logo.png',
      width: 512,
      height: 512,
    },
    image: 'https://framex.vn/og-default.png',
    serviceArea: { '@type': 'Country', name: 'Vietnam' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Giải pháp 3-trong-1',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kết cấu thép tiền chế',
            description: 'Pre-engineered steel structure fabrication and installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cách nhiệt hiệu suất cao',
            description: 'High-performance building insulation systems',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chống thấm toàn diện',
            description: 'Comprehensive waterproofing solutions for building envelope',
          },
        },
      ],
    },
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />

      {/* 1. Hero — Zen landing */}
      <HeroSection locale={locale} />

      {/* 2. Guided question */}
      <GuidedQuestion locale={locale} />

      {/* 3. Bridge line */}
      <BridgeSection locale={locale} />

      {/* 4. Pain section */}
      <PainSection locale={locale} />

      {/* 5. 3-in-1 Solution */}
      <SolutionSection locale={locale} />

      {/* 6. Audience split */}
      <AudienceSection locale={locale} />

      {/* 7. Projects preview */}
      <ProjectsPreview locale={locale} />

      {/* 8. Trust section */}
      <TrustSection locale={locale} />

      {/* 9. Final CTA */}
      <FinalCTA locale={locale} />
    </>
  );
}
