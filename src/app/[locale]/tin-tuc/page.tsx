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
      {/* ── PAGE HEADER ── */}
      <section
        className="pt-36 pb-20 relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 80px),
              repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 80px)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-base">
          <div className="flex items-center gap-4 mb-6">
            <span className="divider-accent" aria-hidden="true" />
          </div>
          <h1
            className="font-display font-bold text-balance mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
            }}
          >
            {t('headline')}
          </h1>
          <p
            className="text-lg max-w-xl"
            style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}
          >
            {t('sub')}
          </p>
        </div>
      </section>

      {/* ── POST GRID ── */}
      <section
        className="section-padding"
        style={{ background: '#1A1A1A' }}
      >
        <div className="container-base">
          {posts.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
              {t('empty')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/tin-tuc/${post.slug}`}
                  className="group block"
                >
                  {/* Cover image */}
                  {post.cover_image && (
                    <div
                      className="aspect-[16/9] mb-4 overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}
                    >
                      <img
                        src={post.cover_image}
                        alt={tField(post as never, 'title', locale)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Category */}
                  {post.category && (
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{
                        color: '#FF6B35',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {post.category}
                    </p>
                  )}

                  {/* Title */}
                  <h2
                    className="font-semibold mb-2 transition-colors line-clamp-2"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#FFFFFF',
                      lineHeight: '1.35',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                  >
                    {tField(post as never, 'title', locale)}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-sm line-clamp-2 mb-3"
                    style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}
                  >
                    {tField(post as never, 'excerpt', locale)}
                  </p>

                  {/* Reading time */}
                  {post.reading_time && (
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}
                    >
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
