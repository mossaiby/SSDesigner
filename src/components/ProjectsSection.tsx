import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, Image as ImageIcon, MapPin } from 'lucide-react';

interface ProjectsSectionProps {
  isStandalonePage?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ isStandalonePage = false }) => {
  const { 
    projectsList, 
    mediaList, 
    navigateTo, 
    openGalleryModal, 
    openLeadModal,
    isAdminLoggedIn
  } = useData();

  const filteredProjects = projectsList;

  return (
    <section className={`py-16 sm:py-24 bg-slate-100/50 dark:bg-slate-950 transition-colors ${isStandalonePage ? 'min-h-screen' : 'border-b border-slate-200 dark:border-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
            <span>Real-World Engineering Deployments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-3">
            Structures Engineered with Our Solvers
          </h2>
          <p className="text-base text-slate-800 dark:text-slate-300 font-normal leading-relaxed">
            From Olympic-class long-span sports stadia to expressive botanical geodesic domes and transit terminals, explore structures engineered with our mathematical software.
          </p>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/30 p-12 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">Real-World Case Studies</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
              {isAdminLoggedIn 
                ? 'Case studies, FEA models, clear spans, and erection photos published in the Admin Console will appear here.'
                : 'Case studies, finite-element models, and erection documentation are compiled regularly. Inquire with our engineering team for technical portfolios and project archives.'}
            </p>
            {isAdminLoggedIn ? (
              <button
                onClick={() => navigateTo({ view: 'admin' })}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
              >
                Add Project Case Study in Admin Console
              </button>
            ) : (
              <button
                onClick={() => openLeadModal({ inquiryType: 'Consulting / Engineering Partnership' })}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
              >
                Inquire About Engineering Case Studies
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(proj => {
            const mediaCount = mediaList.filter(m => m.targetType === 'project' && m.targetId === proj.id).length;

            return (
              <div
                key={proj.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-cyan-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div>
                  {/* Hero Visual Image */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={proj.heroImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-70" />

                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-800 text-[11px] font-mono text-cyan-300">
                      {proj.category}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGalleryModal(proj.id, 'project', proj.title);
                      }}
                      className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Gallery ({mediaCount})</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-400 mb-2 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {proj.location}
                      </span>
                      <span>·</span>
                      <span>{proj.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                      {proj.subtitle}
                    </p>

                    {/* Metric Badges */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono mb-4">
                      <div>
                        <div className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-semibold">Clear Span</div>
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{proj.span}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-700 dark:text-slate-400 uppercase font-semibold">Saved Weight</div>
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">{proj.steelWeightSaved}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-400 line-clamp-2">
                      <span className="text-cyan-700 dark:text-cyan-400 font-mono font-semibold">Solution:</span> {proj.engineeringSolution}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigateTo({ view: 'project', id: proj.id })}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors flex items-center justify-between"
                  >
                    <span>View Case Study & Gallery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
