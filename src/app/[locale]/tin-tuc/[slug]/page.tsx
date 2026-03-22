import { getTranslations } from 'next-intl/server';
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
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (!data) return { title: 'Post not found' };
    return {
      title: tField(data, 'meta_title', locale) || tField(data, 'title', locale),
      description: tField(data, 'meta_desc', locale) || tField(data, 'excerpt', locale),
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
    author: { '@type': 'Organization', name: 'FrameX' },
    publisher: {
      '@type': 'Organization',
      name: 'FrameX',
      logo: { '@type': 'ImageObject', url: 'https://framex.vn/images/logo.png' },
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <nav className="pt-24 pb-4 bg-brand-white border-b border-brand-gray-100" aria-label="Breadcrumb">
        <div className="container-base">
          <ol className="flex items-center gap-2 text-sm text-brand-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-brand-black">FrameX</Link></li>
            <li>/</li>
            <li><Link href={`/${locale}/tin-tuc`} className="hover:text-brand-black">
              {locale === 'vi' ? 'Tin tức' : 'Insights'}
            </Link></li>
            <li>/</li>
            <li className="text-brand-black line-clamp-1">{tField(post as never, 'title', locale)}</li>
          </ol>
        </div>
      </nav>

      <article className="section-padding bg-brand-white">
        <div className="container-base max-w-3xl">
          {post.category && (
            <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-4 font-medium">
              {post.category}
            </p>
          )}
          <h1 className="text-display-md font-semibold text-brand-black mb-4">
            {tField(post as never, 'title', locale)}
          </h1>
          <p className="text-lg text-brand-gray-500 mb-8">
            {tField(post as never, 'excerpt', locale)}
          </p>

          <div className="flex gap-4 text-sm text-brand-gray-400 mb-12 pb-8 border-b border-brand-gray-100">
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

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={tField(post as never, 'title', locale)}
              className="w-full rounded-sm mb-12"
            />
          )}

          <div
            className="prose-framex"
            dangerouslySetInnerHTML={{
              __html: tField(post as never, 'content', locale) || '',
            }}
          />
        </div>
      </article>

      <div className="py-12 border-t border-brand-gray-100 bg-brand-white">
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
