import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Post } from '@/types/content';
import JsonLd from '@/components/seo/JsonLd';

type Props = { params: { locale: string; slug: string } };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (!data) return { title: 'Post not found' };
    const title       = tField(data, 'meta_title', locale) || tField(data, 'title', locale);
    const description = tField(data, 'meta_desc',  locale) || tField(data, 'excerpt', locale);
    return {
      title,
      description,
      alternates: {
        canonical: `/${locale}/tin-tuc/${params.slug}`,
        languages: {
          vi: `/vi/tin-tuc/${params.slug}`,
          en: `/en/tin-tuc/${params.slug}`,
        },
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: data.published_at ?? undefined,
        modifiedTime:  data.updated_at  ?? undefined,
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
    return { title: 'Post' };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'blog' });

  let post: Post | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();
    post = data;
  } catch {
    notFound();
  }

  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tField(post as never, 'title', locale),
    description: tField(post as never, 'excerpt', locale),
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'FrameX', url: 'https://framex.vn' },
    publisher: {
      '@type': 'Organization',
      name: 'FrameX',
      logo: { '@type': 'ImageObject', url: 'https://framex.vn/images/logo.png' },
    },
    url: `https://framex.vn/${locale}/tin-tuc/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://framex.vn/${locale}/tin-tuc/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FrameX', item: `https://framex.vn/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'vi' ? 'Tin tức' : 'Insights', item: `https://framex.vn/${locale}/tin-tuc` },
      { '@type': 'ListItem', position: 3, name: tField(post as never, 'title', locale), item: `https://framex.vn/${locale}/tin-tuc/${post.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <nav className="pt-24 pb-3 bg-brand-white border-b border-brand-gray-100" aria-label="Breadcrumb">
        <div className="container-base">
          {/* flex-wrap + overflow:hidden keeps breadcrumb from overflowing on mobile
              when the post title is very long */}
          <ol className="flex items-center gap-2 text-sm text-brand-gray-400 flex-wrap overflow-hidden">
            <li className="flex-shrink-0"><Link href={`/${locale}`} className="hover:text-brand-black">FrameX</Link></li>
            <li className="flex-shrink-0">/</li>
            <li className="flex-shrink-0"><Link href={`/${locale}/tin-tuc`} className="hover:text-brand-black">
              {locale === 'vi' ? 'Tin tức' : 'Insights'}
            </Link></li>
            <li className="flex-shrink-0">/</li>
            <li
              className="text-brand-black line-clamp-1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: '1 1 0' }}
            >{tField(post as never, 'title', locale)}</li>
          </ol>
        </div>
      </nav>

      <article className="bg-brand-white" style={{ paddingTop: '1.75rem', paddingBottom: '3.5rem' }}>
        <div className="container-base max-w-3xl">

          {/* ── Category label ───────────────────────────── */}
          {post.category && (
            <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-2 font-medium">
              {post.category === 'pain-based'  ? (locale === 'vi' ? 'Tình huống thực tế' : 'Pain-based')  :
               post.category === 'comparative' ? (locale === 'vi' ? 'So sánh'            : 'Comparative')  :
               post.category === 'case-based'  ? (locale === 'vi' ? 'Case study'         : 'Case study')   :
               post.category === 'technical'   ? (locale === 'vi' ? 'Kỹ thuật / Quy trình' : 'Technical / Process') :
               post.category}
            </p>
          )}

          {/* ── Title ─────────────────────────────────────── */}
          <h1 className="text-display-md font-semibold text-brand-black mb-3 leading-tight" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {tField(post as never, 'title', locale)}
          </h1>

          {/* ── Excerpt ───────────────────────────────────── */}
          <p className="text-lg text-brand-gray-500 mb-4 leading-relaxed" style={{ overflowWrap: 'break-word', maxWidth: 'none' }}>
            {tField(post as never, 'excerpt', locale)}
          </p>

          {/* ── Meta row (date + reading time) ────────────── */}
          <div className="flex flex-wrap gap-4 text-sm text-brand-gray-400 mb-5 pb-4 border-b border-brand-gray-100">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString(
                  locale === 'vi' ? 'vi-VN' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </time>
            )}
            {post.reading_time && (
              <span>{post.reading_time} {t('min_read')}</span>
            )}
          </div>

          {/* ── Cover image ───────────────────────────────── */}
          {post.cover_image && (
            <div className="mb-8 rounded-sm overflow-hidden">
              <img
                src={post.cover_image}
                alt={tField(post as never, 'title', locale)}
                className="w-full"
                style={{ display: 'block', maxHeight: '480px', objectFit: 'cover', width: '100%' }}
                loading="eager"
                decoding="async"
              />
            </div>
          )}

          {/* ── Body content ─────────────────────────────── */}
          <div
            className="prose-framex"
            dangerouslySetInnerHTML={{
              __html: tField(post as never, 'content', locale) || '',
            }}
          />
        </div>
      </article>

      <div className="py-8 border-t border-brand-gray-100 bg-brand-white">
        <div className="container-base flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
          <Link
            href={`/${locale}/tin-tuc`}
            className="text-sm text-brand-gray-400 hover:text-brand-black transition-colors"
          >
            ← {locale === 'vi' ? 'Tất cả bài viết' : 'All posts'}
          </Link>
          <Link
            href={`/${locale}/lien-he`}
            className="px-6 py-3 bg-brand-black text-brand-white text-sm font-medium hover:bg-brand-gray-800 transition-colors rounded-sm"
          >
            {locale === 'vi' ? 'Trao đổi với FrameX' : 'Talk to FrameX'}
          </Link>
        </div>
      </div>
    </>
  );
}
