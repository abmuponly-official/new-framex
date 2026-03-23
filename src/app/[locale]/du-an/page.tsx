import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Project, ProjectCategory } from '@/types/content';
import Image from 'next/image';
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
  const t = await getTranslations({ locale, namespace: 'projects' });
  return {
    title: t('headline'),
    description: t('sub'),
    alternates: {
      canonical: `/${locale}/du-an`,
      languages: { vi: '/vi/du-an', en: '/en/du-an' },
    },
  };
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  // ── Fetch all published projects (sorted by sort_order) ──────────────────
  let allProjects: Project[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });
    allProjects = data ?? [];
  } catch {
    // graceful degrade — show empty state
  }

  // ── Filter by category ────────────────────────────────────────────────────
  const activeCategory = (searchParams.cat ?? '') as ProjectCategory | '';
  const filtered = activeCategory
    ? allProjects.filter((p) => p.category === activeCategory)
    : allProjects;

  // ── Pagination ────────────────────────────────────────────────────────────
  const currentPage  = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage     = Math.min(currentPage, totalPages);
  const pageProjects = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Filter options (using translation keys already in messages) ──────────
  // Map DB category values → translated labels from the projects namespace
  const categoryFilters = [
    { value: '', label: t('filter_all') },
    { value: 'residential', label: t('filter_residential') },
    { value: 'fnb',         label: t('filter_fnb') },
    { value: 'hospitality', label: t('filter_hospitality') },
    { value: 'industrial',  label: t('filter_industrial') },
  ];

  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section
        className="pt-36 pb-20 relative overflow-hidden"
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
              maxWidth: '36ch',
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
      <section className="section-padding" style={{ background: '#1A1A1A' }}>
        <div className="container-base">

          {/* Filter bar */}
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
              {t('filter_headline')}
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
              {filtered.length} {locale === 'vi' ? 'dự án' : 'project'}{filtered.length !== 1 && locale !== 'vi' ? 's' : ''}
              {activeCategory ? ` · ${categoryFilters.find(f => f.value === activeCategory)?.label ?? activeCategory}` : ''}
            </p>
          )}

          {/* Grid */}
          {pageProjects.length === 0 ? (
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
              {pageProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                  viewLabel={t('view')}
                  proofWatertestLabel={t('proof_watertest')}
                  proofCoLabel={t('proof_co')}
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

// ── Project Card (server component, no interactivity needed) ─────────────────
function ProjectCard({
  project,
  locale,
  viewLabel,
  proofWatertestLabel,
  proofCoLabel,
}: {
  project: Project;
  locale: string;
  viewLabel: string;
  proofWatertestLabel: string;
  proofCoLabel: string;
}) {
  const title   = tField(project as never, 'title', locale as 'vi' | 'en');
  const excerpt = tField(project as never, 'excerpt', locale as 'vi' | 'en');

  return (
    <Link
      href={`/${locale}/du-an/${project.slug}`}
      className="group block"
      style={{
        // Ensure cards are the same height in each grid row
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Cover image ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          borderRadius: '2px',
          background: 'rgba(44,44,44,0.6)',
          flexShrink: 0,
          marginBottom: '16px',
        }}
      >
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={title}
            fill
            style={{ objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease' }}
            className="group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
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
                color: 'rgba(255,255,255,0.15)',
              }}
            >
              FRAME<span style={{ color: 'rgba(255,107,53,0.4)' }}>X</span>
            </span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: '#FF6B35',
              color: '#fff',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '2px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {locale === 'vi' ? 'Tiêu biểu' : 'Featured'}
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
            padding: '14px',
            transition: 'background .3s',
          }}
          className="group-hover:[background:rgba(0,0,0,0.45)]"
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff',
              opacity: 0,
              transition: 'opacity .3s',
              paddingBottom: '2px',
              borderBottom: '1px solid rgba(255,107,53,0.8)',
            }}
            className="group-hover:opacity-100"
          >
            {viewLabel} →
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Proof chips */}
        {(project.has_watertest || project.has_co) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
            {project.has_watertest && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 8px',
                  background: 'rgba(255,107,53,0.08)',
                  border: '1px solid rgba(255,107,53,0.2)',
                  color: '#FF6B35',
                  borderRadius: '2px',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {proofWatertestLabel}
              </span>
            )}
            {project.has_co && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  padding: '2px 8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)',
                  borderRadius: '2px',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {proofCoLabel}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: '1.35',
            marginBottom: '8px',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            // clamp to 2 lines
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
            // clamp to 2 lines
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {excerpt}
        </p>

        {/* Meta row: location · year */}
        {(project.location || project.year) && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {project.location && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.02em',
                }}
              >
                {project.location}
              </span>
            )}
            {project.year && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.02em',
                }}
              >
                {project.year}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
