import { getTranslations } from 'next-intl/server';
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
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (!data) return { title: 'Project not found' };
    return {
      title: tField(data, 'meta_title', locale) || tField(data, 'title', locale),
      description: tField(data, 'meta_desc', locale) || tField(data, 'excerpt', locale),
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
    author: { '@type': 'Organization', name: 'FrameX' },
    publisher: {
      '@type': 'Organization',
      name: 'FrameX',
      url: 'https://framex.vn',
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      {/* Breadcrumb */}
      <nav className="pt-24 pb-4 bg-brand-white border-b border-brand-gray-100" aria-label="Breadcrumb">
        <div className="container-base">
          <ol className="flex items-center gap-2 text-sm text-brand-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-brand-black">FrameX</Link></li>
            <li>/</li>
            <li><Link href={`/${locale}/du-an`} className="hover:text-brand-black">{t('headline').split('.')[0]}</Link></li>
            <li>/</li>
            <li className="text-brand-black line-clamp-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: '1 1 0' }}>{tField(project as never, 'title', locale)}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
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
          <h1 className="text-display-md font-semibold text-brand-black mb-4" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {tField(project as never, 'title', locale)}
          </h1>
          <p className="text-lg text-brand-gray-500" style={{ overflowWrap: 'break-word' }}>
            {tField(project as never, 'excerpt', locale)}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm text-brand-gray-400">
            {project.client_name && <span>{project.client_name}</span>}
            {project.location && <span>{project.location}</span>}
            {project.year && <span>{project.year}</span>}
          </div>
        </div>
      </section>

      {/* Cover image */}
      {project.cover_image && (
        <div className="bg-brand-gray-50">
          <div className="container-base py-0">
            <img
              src={project.cover_image}
              alt={tField(project as never, 'title', locale)}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="section-padding bg-brand-white">
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
        <section className="section-padding bg-brand-gray-50 border-t border-brand-gray-100">
          <div className="container-base">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.gallery.map((item, i) => (
                <figure key={i}>
                  <img
                    src={item.url}
                    alt={locale === 'vi' ? item.caption_vi : item.caption_en}
                    className="w-full aspect-[4/3] object-cover rounded-sm"
                    loading="lazy"
                  />
                  {(item.caption_vi || item.caption_en) && (
                    <figcaption className="text-xs text-brand-gray-400 mt-2">
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
      <section className="py-16 bg-brand-white border-t border-brand-gray-100">
        <div className="container-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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
