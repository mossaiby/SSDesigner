import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Image as ImageIcon, 
  Play, 
  Film, 
  Plus, 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import { FormattedMathText } from './MathRenderer';

interface ProjectDetailPageProps {
  projectId: string;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId }) => {
  const { 
    projectsList, 
    softwareList, 
    mediaList, 
    navigateTo, 
    openLeadModal, 
    openGalleryModal, 
    openMediaLightbox, 
    can 
  } = useData();

  const project = projectsList.find(p => p.id === projectId) || projectsList[0];

  // Media associated with this project
  const projectMedia = mediaList.filter(m => m.targetType === 'project' && m.targetId === project.id);

  // Software objects used
  const relatedSoftware = softwareList.filter(s => 
    project.softwareUsed.some(name => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase()))
  );

  useEffect(() => {
    document.title = `${project.title} – Real-World Space Structure Case Study | SSDesigner`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project]);

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigateTo({ view: 'all_projects' })}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Real-World Projects
        </button>
      </div>

      {/* Prominent Header */}
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{project.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {project.location}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Completed {project.year}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4 text-balance">
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mb-6 font-normal">
          {project.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openGalleryModal(project.id, 'project', project.title)}
            className="px-5 py-3 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Open Case Study Gallery ({projectMedia.length})</span>
          </button>

          <button
            onClick={() => openLeadModal({ inquiryType: 'Consulting / Engineering Partnership' })}
            className="px-5 py-3 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
          >
            Inquire for Similar Project
          </button>
        </div>
      </header>

      {/* Hero Banner Imagery */}
      <div className="max-w-6xl mx-auto mb-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative aspect-video max-h-[500px] w-full bg-slate-950 overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="text-white text-xs font-mono">
              <span className="text-cyan-400">Structural Typology:</span> {project.structuralSystem}
            </div>
            <div className="text-slate-300 text-xs font-mono">
              Client / Authority: {project.clientOrEngineer}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Challenges, Solutions & Gallery */}
        <div className="lg:col-span-8 space-y-12">
          {/* Engineering Challenges */}
          <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Structural Challenge & Boundary Conditions
            </h3>
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <FormattedMathText text={project.challenge} />
            </div>
          </section>

          {/* Engineering Solution & Software Role */}
          <section className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Computational Solution & Role of Software
            </h3>
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              <FormattedMathText text={project.engineeringSolution} />
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                SSDesigner Solvers Deployed on this Project:
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.softwareUsed.map((softName, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white shadow-sm"
                  >
                    {softName}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Dedicated Photo & Video Gallery Section */}
          <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                  Project Gallery: Photos & Verification Footage
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Construction phases, site photography, and dynamic FEA simulation videos. Click to browse with next / prev controls.
                </p>
              </div>

              <button
                onClick={() => openGalleryModal(project.id, 'project', project.title)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                Manage Media
              </button>
            </div>

            {projectMedia.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/20 text-center">
                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-400 mb-1">
                  Project gallery initialized and awaiting media assets
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Add photos, architectural photography, and simulation videos through the admin account.
                </p>
                {can('manage_media') && (
                  <button
                    onClick={() => openGalleryModal(project.id, 'project', project.title)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                  >
                    Upload First Media Asset
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectMedia.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openMediaLightbox(item, projectMedia)}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden cursor-pointer hover:border-cyan-500 transition-all shadow-sm"
                  >
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img
                        src={item.type === 'photo' ? item.url : (item.thumbnailUrl || item.url)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300">
                        {item.type.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sticky Column: Quantitative Metrics & Outcomes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md">
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              Structural Telemetry & Outcomes
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Clear Span</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{project.span}</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Steel Material Saved</div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{project.steelWeightSaved}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Spatial Nodes</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{project.nodeCount}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Members</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{project.memberCount}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase mb-1">Structural System</div>
                <div className="text-xs text-slate-800 dark:text-slate-300 font-sans">{project.structuralSystem}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase mb-1">Authority / Lead Engineer</div>
                <div className="text-xs text-slate-800 dark:text-slate-300 font-sans">{project.clientOrEngineer}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => openLeadModal({ inquiryType: 'Consulting / Engineering Partnership' })}
                className="w-full py-2.5 px-4 font-semibold text-xs rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Inquire for Similar Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
