import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/request';
import { createClient } from '@/lib/supabase/server';
import { t as tField } from '@/types/content';
import type { Project } from '@/types/content';

type Props = { locale: Locale };

export default async function ProjectsPreview({ locale }: Props) {
  const trans = await getTranslations({ locale, namespace: 'home' });
  const projTrans = await getTranslations({ locale, namespace: 'projects' });

  // Fetch 3 featured projects from Supabase
  let projects: Project[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(3);
    projects = data ?? [];
  } catch {
    // Gracefully degrade — show placeholder cards
  }

  return (
    <section
      className="section-padding bg-brand-white"
      aria-labelledby="projects-heading"
    >
      <div className="container-base">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-gray-400 mb-3 font-medium">
              {trans('projects_eyebrow')}
            </p>
            <h2
              id="projects-heading"
              className="text-display-md font-semibold text-brand-black max-w-xl"
            >
              {trans('projects_headline')}
            </h2>
          </div>
          <Link
            href={`/${locale}/du-an`}
            className="text-sm font-medium text-brand-gray-500 hover:text-brand-black transition-colors shrink-0"
          >
            {trans('projects_cta')} →
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/du-an/${project.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-brand-gray-100 mb-4 overflow-hidden rounded-sm">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={tField(project as never, 'title', locale)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-brand-gray-300 text-sm">FrameX</span>
                    </div>
                  )}
                </div>

                {/* Proof chips */}
                <div className="flex gap-2 mb-3">
                  {project.has_watertest && (
                    <span className="text-xs px-2 py-0.5 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                      {projTrans('proof_watertest')}
                    </span>
                  )}
                  {project.has_co && (
                    <span className="text-xs px-2 py-0.5 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                      {projTrans('proof_co')}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-brand-black mb-1 group-hover:underline">
                  {tField(project as never, 'title', locale)}
                </h3>
                <p className="text-sm text-brand-gray-500 line-clamp-2">
                  {tField(project as never, 'excerpt', locale)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          /* Placeholder for when DB is not yet seeded */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Tuệ House', 'Gold Coffee', "Cozy's Homestay"].map((name) => (
              <div key={name} className="group">
                <div className="aspect-[4/3] bg-brand-gray-100 mb-4 rounded-sm flex items-center justify-center">
                  <span className="text-brand-gray-300 text-sm">{name}</span>
                </div>
                <h3 className="font-semibold text-brand-black mb-1">{name}</h3>
                <p className="text-sm text-brand-gray-400">
                  {locale === 'vi' ? 'Sắp có nội dung.' : 'Coming soon.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
