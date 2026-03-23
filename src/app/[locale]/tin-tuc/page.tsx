import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Post, PostCategory } from '@/types/content';
import FilterBar from '@/components/ui/FilterBar';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 6;

type Props = {
  params: { locale: string };
  searchParams: { cat?: string; page?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: {
      canonical: `/${locale}/tin-tuc`,
      languages: { vi: '/vi/tin-tuc', en: '/en/tin-tuc' },
    },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  // ── Fetch all published posts ─────────────────────────────────────────────
  let allPosts: Post[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    allPosts = data ?? [];
  } catch {
    // graceful degrade
  }

  // ── Filter by category ────────────────────────────────────────────────────
  const activeCategory = (searchParams.cat ?? '') as PostCategory | '';
  const filtered = activeCategory
    ? allPosts.filter((p) => p.category === activeCategory)
    : allPosts;

  // ── Pagination ────────────────────────────────────────────────────────────
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(currentPage, totalPages);
  const pagePosts   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Category filter options ───────────────────────────────────────────────
  // PostCategory values mapped to translated pillar names already in blog namespace
  const categoryFilters = [
    { value: '',            label: locale === 'vi' ? 'Tất cả'            : 'All' },
    { value: 'pain-based',  label: t('pillar_1') },   // "Pain-based"
    { value: 'comparative', label: t('pillar_2') },   // "Comparative"
    { value: 'case-based',  label: t('pillar_3') },   // "Case-based"
    { value: 'technical',   label: t('pillar_4') },   // "Technical / Process"
  ];

  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="pt-32 pb-12 relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg,rgba(255,255,255,0.6) 0px,rgba(255,255,255,0.6) 1px,transparent 1px,transparent 80px),
              repeating-linear-gradient(180deg,rgba(255,255,255,0.6) 0px,rgba(255,255,255,0.6) 1px,transparent 1px,transparent 80px)`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-base">
          <div className="flex items-center gap-4 mb-6">
            <span className="divider-accent" aria-hidden="true" />
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FF6B35',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {t('eyebrow')}
            </span>
          </div>
          <h1
            className="font-display font-bold text-balance mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.025em',
              lineHeight: '1.15',
              maxWidth: '40ch',
            }}
          >
            {t('headline')}
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: '1.75',
              maxWidth: '52ch',
            }}
          >
            {t('sub')}
          </p>
        </div>
      </section>

      {/* ── FILTER + GRID ────────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A]" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <div className="container-base">

          {/* Filter bar — pillar categories */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              {t('pillars_headline')}
            </p>
            <Suspense fallback={null}>
              <FilterBar
                options={categoryFilters}
                paramKey="cat"
                currentValue={activeCategory}
              />
            </Suspense>
          </div>

          {/* Result count */}
          {filtered.length > 0 && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.2)',
                marginBottom: '28px',
              }}
            >
              {filtered.length} {locale === 'vi' ? 'bài viết' : `article${filtered.length !== 1 ? 's' : ''}`}
              {activeCategory ? ` · ${categoryFilters.find(f => f.value === activeCategory)?.label ?? activeCategory}` : ''}
            </p>
          )}

          {/* Grid */}
          {pagePosts.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: '0.9375rem' }}>
                {t('empty')}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: '32px',
              }}
            >
              {pagePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  minReadLabel={t('min_read')}
                  readMoreLabel={t('read_more')}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Suspense fallback={null}>
            <Pagination currentPage={safePage} totalPages={totalPages} />
          </Suspense>

        </div>
      </section>
    </>
  );
}

// ── Category label map ────────────────────────────────────────────────────────
const CATEGORY_EN: Record<string, string> = {
  'pain-based':  'Pain-based',
  'comparative': 'Comparative',
  'case-based':  'Case-based',
  'technical':   'Technical',
};

const CATEGORY_VI: Record<string, string> = {
  'pain-based':  'Thực tế',
  'comparative': 'So sánh',
  'case-based':  'Case study',
  'technical':   'Kỹ thuật',
};

// ── Post Card (server component) ─────────────────────────────────────────────
function PostCard({
  post,
  locale,
  minReadLabel,
  readMoreLabel,
}: {
  post: Post;
  locale: string;
  minReadLabel: string;
  readMoreLabel: string;
}) {
  const title   = tField(post as never, 'title', locale as 'vi' | 'en');
  const excerpt = tField(post as never, 'excerpt', locale as 'vi' | 'en');

  const categoryLabel = post.category
    ? (locale === 'vi' ? CATEGORY_VI[post.category] : CATEGORY_EN[post.category]) ?? post.category
    : null;

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        locale === 'vi' ? 'vi-VN' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' },
      )
    : null;

  return (
    <Link
      href={`/${locale}/tin-tuc/${post.slug}`}
      className="group block"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Cover image ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          overflow: 'hidden',
          borderRadius: '2px',
          background: 'rgba(44,44,44,0.6)',
          flexShrink: 0,
          marginBottom: '16px',
        }}
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.7s ease',
            }}
            className="group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Consistent placeholder — same height as a 16/9 image would be */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.12)',
              }}
            >
              FRAME<span style={{ color: 'rgba(255,107,53,0.35)' }}>X</span>
            </span>
          </div>
        )}

        {/* Category badge over image */}
        {categoryLabel && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              padding: '3px 10px',
              borderRadius: '2px',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FF6B35',
              }}
            >
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Hover CTA overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '14px',
            transition: 'background .3s',
          }}
          className="group-hover:[background:rgba(0,0,0,0.4)]"
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: '#fff',
              opacity: 0,
              transition: 'opacity .3s',
              paddingBottom: '2px',
              borderBottom: '1px solid rgba(255,107,53,0.7)',
            }}
            className="group-hover:opacity-100"
          >
            {readMoreLabel} →
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <h2
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: '1.4',
            marginBottom: '8px',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.38)',
            lineHeight: '1.65',
            overflowWrap: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
            marginBottom: '12px',
          }}
        >
          {excerpt}
        </p>

        {/* Meta row: date · reading time */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            alignItems: 'center',
          }}
        >
          {dateStr && (
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.02em',
              }}
            >
              {dateStr}
            </span>
          )}
          {post.reading_time && (
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.02em',
              }}
            >
              {post.reading_time} {minReadLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
