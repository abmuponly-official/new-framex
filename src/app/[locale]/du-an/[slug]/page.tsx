import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Project } from '@/types/content';
import JsonLd from '@/components/seo/JsonLd';

type Props = { params: { locale: string; slug: string } };

export const revalidate = 60; // ISR — revalidate every 60 seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (!data) return { title: 'Project not found' };
    const title       = tField(data, 'meta_title', locale) || tField(data, 'title', locale);
    const description = tField(data, 'meta_desc',  locale) || tField(data, 'excerpt', locale);
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/du-an/${params.slug}`,
        languages: {
          vi: `/vi/du-an/${params.slug}`,
          en: `/en/du-an/${params.slug}`,
        },
      },
      openGraph: {
        title,
        description,
        type: 'article',
        images: data.cover_image ? [{ url: data.cover_image, width: 1200, height: 630, alt: title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: data.cover_image ? [data.cover_image] : [],
      },
    };
  } catch {
    return { title: 'Project' };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'projects' });

  let project: Project | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();
    project = data;
  } catch {
    notFound();
  }

  if (!project) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'CreativeWork'],
    headline: tField(project as never, 'title', locale),
    description: tField(project as never, 'excerpt', locale),
    image: project.cover_image,
    datePublished: project.published_at,
    author: { '@type': 'Organization', name: 'FrameX', url: 'https://framex.vn' },
    publisher: {
      '@type': 'Organization',
      name: 'FrameX',
      url: 'https://framex.vn',
    },
    url: `https://framex.vn/${locale}/du-an/${project.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://framex.vn/${locale}/du-an/${project.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FrameX', item: `https://framex.vn/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'vi' ? 'Dự án' : 'Projects', item: `https://framex.vn/${locale}/du-an` },
      { '@type': 'ListItem', position: 3, name: tField(project as never, 'title', locale), item: `https://framex.vn/${locale}/du-an/${project.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <nav className="pt-24 pb-3 bg-brand-white border-b border-brand-gray-100" aria-label="Breadcrumb">
        <div className="container-base">
          {/* overflow:hidden on <ol> prevents the flex row from overflowing when
              the last breadcrumb item (project title) is very long */}
          <ol className="flex items-center gap-2 text-sm text-brand-gray-400 overflow-hidden">
            <li className="flex-shrink-0"><Link href={`/${locale}`} className="hover:text-brand-black">FrameX</Link></li>
            <li className="flex-shrink-0">/</li>
            <li className="flex-shrink-0"><Link href={`/${locale}/du-an`} className="hover:text-brand-black">{t('headline').split('.')[0]}</Link></li>
            <li className="flex-shrink-0">/</li>
            <li className="text-brand-black line-clamp-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: '1 1 0' }}>{tField(project as never, 'title', locale)}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-6 pb-5 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-4xl">

          {/* Proof chips */}
          {(project.has_watertest || project.has_co) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.has_watertest && (
                <span className="text-xs px-2 py-1 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                  {t('proof_watertest')}
                </span>
              )}
              {project.has_co && (
                <span className="text-xs px-2 py-1 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                  {t('proof_co')}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-display-md font-semibold text-brand-black mb-3 leading-tight" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {tField(project as never, 'title', locale)}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-brand-gray-500 mb-4 leading-relaxed" style={{ overflowWrap: 'break-word', maxWidth: 'none' }}>
            {tField(project as never, 'excerpt', locale)}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-sm text-brand-gray-400">
            {project.client_name && <span>{project.client_name}</span>}
            {project.location && (
              <>
                {project.client_name && <span aria-hidden>·</span>}
                <span>{project.location}</span>
              </>
            )}
            {project.year && (
              <>
                {(project.client_name || project.location) && <span aria-hidden>·</span>}
                <span>{project.year}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Cover image — full-bleed in a light-gray band */}
      {project.cover_image && (
        <div className="bg-brand-gray-50">
          <div className="container-base max-w-4xl" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
            <img
              src={project.cover_image}
              alt={tField(project as never, 'title', locale)}
              className="w-full rounded-sm"
              style={{ display: 'block', maxHeight: '480px', objectFit: 'cover' }}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="bg-brand-white" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container-base max-w-3xl">
          <div
            className="prose-framex"
            dangerouslySetInnerHTML={{
              __html: tField(project as never, 'content', locale) || '',
            }}
          />
        </div>
      </article>

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <section className="bg-brand-gray-50 border-t border-brand-gray-100" style={{ paddingTop: '2rem', paddingBottom: '2.5rem' }}>
          <div className="container-base max-w-4xl">
            <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
              {locale === 'vi' ? 'Thư viện ảnh' : 'Gallery'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.gallery.map((item, i) => (
                <figure key={i}>
                  <img
                    src={item.url}
                    alt={locale === 'vi' ? item.caption_vi : item.caption_en}
                    className="w-full aspect-[4/3] object-cover rounded-sm"
                    loading="lazy"
                  />
                  {(item.caption_vi || item.caption_en) && (
                    <figcaption className="text-xs text-brand-gray-400 mt-1.5 leading-snug">
                      {locale === 'vi' ? item.caption_vi : item.caption_en}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back + CTA */}
      <section className="py-8 bg-brand-white border-t border-brand-gray-100">
        <div className="container-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href={`/${locale}/du-an`}
            className="text-sm text-brand-gray-400 hover:text-brand-black transition-colors"
          >
            ← {locale === 'vi' ? 'Tất cả dự án' : 'All projects'}
          </Link>
          <Link
            href={`/${locale}/lien-he`}
            className="px-6 py-3 bg-brand-black text-brand-white text-sm font-medium hover:bg-brand-gray-800 transition-colors rounded-sm"
          >
            {locale === 'vi' ? 'Trao đổi về dự án tương tự' : 'Discuss a similar project'}
          </Link>
        </div>
      </section>
    </>
  );
}
