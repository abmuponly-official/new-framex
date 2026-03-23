import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Project } from '@/types/content';

type Props = { params: { locale: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('headline'), description: t('sub') };
}

export default async function ProjectsPage({ params }: Props) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  let projects: Project[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });
    projects = data ?? [];
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

      {/* ── PROJECT GRID ── */}
      <section
        className="section-padding"
        style={{ background: '#1A1A1A' }}
      >
        <div className="container-base">
          {projects.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
              {t('empty')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/du-an/${project.slug}`}
                  className="group block"
                >
                  {/* Cover image */}
                  <div
                    className="aspect-[4/3] mb-4 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '2px' }}
                  >
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={tField(project as never, 'title', locale)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'rgba(44,44,44,0.6)' }}
                      >
                        <span
                          className="text-sm font-semibold tracking-[0.06em]"
                          style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.2)' }}
                        >
                          FRAME<span style={{ color: '#FF6B35' }}>X</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Proof chips */}
                  {(project.has_watertest || project.has_co) && (
                    <div className="flex gap-2 mb-2">
                      {project.has_watertest && (
                        <span
                          className="text-xs px-2 py-0.5"
                          style={{
                            background: 'rgba(255,107,53,0.1)',
                            border: '1px solid rgba(255,107,53,0.25)',
                            color: '#FF6B35',
                            borderRadius: '2px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {t('proof_watertest')}
                        </span>
                      )}
                      {project.has_co && (
                        <span
                          className="text-xs px-2 py-0.5"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.55)',
                            borderRadius: '2px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {t('proof_co')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Title & excerpt */}
                  <h2
                    className="font-semibold mb-1 transition-colors line-clamp-2"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.9375rem',
                      color: '#FFFFFF',
                      lineHeight: '1.3',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                  >
                    {tField(project as never, 'title', locale)}
                  </h2>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}
                  >
                    {tField(project as never, 'excerpt', locale)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
