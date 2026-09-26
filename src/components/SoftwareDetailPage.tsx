import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  Layers, 
  FileCode2, 
  CheckCircle2, 
  Image as ImageIcon, 
  Film, 
  Play, 
  Download, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  Compass, 
  Plus,
  Sigma
} from 'lucide-react';
import { MarkdownArticleView } from './MathRenderer';
import { INITIAL_SOFTWARE_ITEMS } from '../data/initialData';

interface SoftwareDetailPageProps {
  softwareId: string;
}

export const SoftwareDetailPage: React.FC<SoftwareDetailPageProps> = ({ softwareId }) => {
  const { 
    softwareList, 
    projectsList, 
    mediaList, 
    navigateTo, 
    openLeadModal, 
    openGalleryModal, 
    openMediaLightbox, 
    can 
  } = useData();

  const software = softwareList.find(s => s.id === softwareId) || softwareList[0] || INITIAL_SOFTWARE_ITEMS[0];

  // Projects that used this software
  const usedInProjects = projectsList.filter(p => 
    p.softwareUsed.some(name => software.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(software.name.toLowerCase()))
  );

  // Media associated with this software
  const softwareMedia = mediaList.filter(m => m.targetType === 'software' && m.targetId === software.id);

  // Update document title for Technical SEO
  useEffect(() => {
    document.title = `${software.name} – Space Structures Engineering Software | SSDesigner`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [software]);

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigateTo({ view: 'all_software' })}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Engineering Software
        </button>
      </div>

      {/* Prominent Header Banner */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{software.category}</span>
          <span>·</span>
          <span>Version {software.version}</span>
          <span>·</span>
          <span>Release Date: {software.releaseDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4 text-balance">
          {software.name}
        </h1>

        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed mb-6 font-normal">
          {software.tagline}
        </p>

        {/* CTA Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => openLeadModal({ softwareInterest: software.name, inquiryType: 'Software Demo' })}
            className="px-6 py-3 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/20"
          >
            Request Evaluation License & Live Demo
          </button>

          <button
            onClick={() => openGalleryModal(software.id, 'software', software.name)}
            className="px-5 py-3 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Open Media Gallery ({softwareMedia.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Primary Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Detailed Engineering Overview */}
          <section className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
              Structural Engineering Capabilities
            </h2>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              <MarkdownArticleView content={software.description} />
            </div>
          </section>

          {/* Key Capabilities */}
          {software.keyFeatures && software.keyFeatures.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
                Core Solver Features & Modules
              </h3>
              <div className="space-y-3">
                {software.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dedicated Photo & Video Gallery Section */}
          <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                  Photo & Video Simulation Gallery
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-400">
                  Visual validation records, dynamic simulation clips, and high-resolution meshes. Click any asset to open with next / prev controls.
                </p>
              </div>

              {can('manage_media') && (
                <button
                  onClick={() => openGalleryModal(software.id, 'software', software.name)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Manage Gallery
                </button>
              )}
            </div>

            {softwareMedia.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/20 text-center shadow-xs">
                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
                  Simulation & Validation Records
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                  {can('manage_media')
                    ? 'Photos and video simulations can be uploaded anytime via the administrator console.'
                    : 'High-resolution photographic validation records and dynamic simulation videos for this solver are currently being compiled.'}
                </p>
                {can('manage_media') && (
                  <button
                    onClick={() => openGalleryModal(software.id, 'software', software.name)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
                  >
                    Upload First Media Asset
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {softwareMedia.map(item => (
                  <div
                    key={item.id}
                    onClick={() => openMediaLightbox(item, softwareMedia)}
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

          {/* Real-World Projects Using This Software */}
          {usedInProjects.length > 0 && (
            <section className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-4">
                Real-World Structures Engineered with {software.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usedInProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => navigateTo({ view: 'project', id: proj.id })}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-cyan-500 cursor-pointer transition-colors shadow-sm"
                  >
                    <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mb-1">{proj.category}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{proj.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{proj.location} · {proj.year}</div>
                    {proj.span && <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">Span: {proj.span}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Sidebar: Technical Specifications Matrix */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md">
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <FileCode2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Technical Specifications Matrix
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase">Solver Engine</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{software.specs.solverType}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase">Formulation</span>
                <span className="text-slate-800 dark:text-slate-300">{software.specs.formulation}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase">Tested Capacity</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">{software.specs.maxNodesTested}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase mb-1">Supported Elements</span>
                <div className="flex flex-wrap gap-1">
                  {software.specs.elementsSupported.map((elem, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-800 dark:text-slate-300">
                      {elem}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase mb-1">File I/O Interoperability</span>
                <div className="flex flex-wrap gap-1">
                  {software.specs.fileIOFormats.map((fmt, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-medium">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase">Hardware Acceleration</span>
                <span className="text-slate-800 dark:text-slate-300">{software.specs.hardwareAcceleration}</span>
              </div>

              <div>
                <span className="block font-mono text-[10px] text-slate-700 dark:text-slate-400 font-semibold uppercase mb-1">Engineering Code Compliance</span>
                <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                  {software.specs.complianceStandards.map((std, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-500" />
                      <span>{std}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => openLeadModal({ softwareInterest: software.name, inquiryType: 'Commercial Quotation' })}
                className="w-full py-2.5 px-4 font-semibold text-xs rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
              >
                Inquire for Site License
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
