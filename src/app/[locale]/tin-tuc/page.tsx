import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Post } from '@/types/content';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('headline'), description: t('sub') };
}

export default async function BlogPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  let posts: Post[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    posts = data ?? [];
  } catch {
    // graceful degrade
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-brand-white border-b border-brand-gray-100">
        <div className="container-base">
          <h1 className="text-display-lg font-semibold text-brand-black mb-4">{t('headline')}</h1>
          <p className="text-lg text-brand-gray-500 max-w-xl">{t('sub')}</p>
        </div>
      </section>

      <section className="section-padding bg-brand-white">
        <div className="container-base">
          {posts.length === 0 ? (
            <p className="text-brand-gray-400">{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/tin-tuc/${post.slug}`}
                  className="group block"
                >
                  {post.cover_image && (
                    <div className="aspect-[16/9] bg-brand-gray-100 mb-4 overflow-hidden rounded-sm">
                      <img
                        src={post.cover_image}
                        alt={tField(post as never, 'title', locale)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {post.category && (
                    <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-2 font-medium">
                      {post.category}
                    </p>
                  )}
                  <h2 className="font-semibold text-brand-black group-hover:underline mb-2">
                    {tField(post as never, 'title', locale)}
                  </h2>
                  <p className="text-sm text-brand-gray-500 line-clamp-2 mb-3">
                    {tField(post as never, 'excerpt', locale)}
                  </p>
                  {post.reading_time && (
                    <p className="text-xs text-brand-gray-400">
                      {post.reading_time} {t('min_read')}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
