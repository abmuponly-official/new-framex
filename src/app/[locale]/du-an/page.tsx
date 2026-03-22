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

  const categories = [
    { key: 'all',          label: t('filter_all') },
    { key: 'residential',  label: t('filter_residential') },
    { key: 'fnb',          label: t('filter_fnb') },
    { key: 'hospitality',  label: t('filter_hospitality') },
    { key: 'industrial',   label: t('filter_industrial') },
  ];

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
          {projects.length === 0 ? (
            <p className="text-brand-gray-400">{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/du-an/${project.slug}`}
                  className="group block"
                >
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
                  <div className="flex gap-2 mb-2">
                    {project.has_watertest && (
                      <span className="text-xs px-2 py-0.5 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                        {t('proof_watertest')}
                      </span>
                    )}
                    {project.has_co && (
                      <span className="text-xs px-2 py-0.5 bg-brand-gray-100 text-brand-gray-500 rounded-sm">
                        {t('proof_co')}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-brand-black group-hover:underline mb-1">
                    {tField(project as never, 'title', locale)}
                  </h2>
                  <p className="text-sm text-brand-gray-500 line-clamp-2">
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
