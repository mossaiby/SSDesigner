import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, Image as ImageIcon, Check } from 'lucide-react';

interface SoftwareSectionProps {
  isStandalonePage?: boolean;
}

export const SoftwareSection: React.FC<SoftwareSectionProps> = ({ isStandalonePage = false }) => {
  const { 
    softwareList, 
    mediaList, 
    navigateTo, 
    openGalleryModal, 
    openLeadModal 
  } = useData();

  return (
    <section className={`py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors ${isStandalonePage ? 'min-h-screen' : 'border-b border-slate-200 dark:border-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
            <span>Engineering Calculation Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">
            Specialized Software for Spatial Systems
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            Each solver is purpose-engineered to address geometric nonlinearities, kinematic bifurcations, and pre-stress equilibrium across space structures.
          </p>
        </div>

        {/* Software Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {softwareList.map(soft => {
            const mediaCount = mediaList.filter(m => m.targetType === 'software' && m.targetId === soft.id).length;

            return (
              <div
                key={soft.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div>
                  {/* Category & Version */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono">
                    <span className="text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-900/40">
                      {soft.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      v{soft.version}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {soft.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                    {soft.tagline}
                  </p>

                  {/* Preview Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <img
                      src={soft?.thumbnail || '/src/assets/images/software_form_finding_1790188528595.jpg'}
                      alt={soft?.name || 'Engineering Software'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                    <button
                      onClick={() => openGalleryModal(soft.id, 'software', soft.name)}
                      className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Gallery ({mediaCount})</span>
                    </button>
                  </div>

                  {/* Key Capabilities Bullet Points */}
                  <div className="space-y-2 mb-6">
                    {(soft?.keyFeatures || []).slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Specifications Spec Pill */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mb-6 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <div><span className="text-cyan-700 dark:text-cyan-400 font-semibold">Solver:</span> {soft?.specs?.solverType || 'Dynamic Relaxation'}</div>
                    <div><span className="text-cyan-700 dark:text-cyan-400 font-semibold">Capacity:</span> {soft?.specs?.maxNodesTested || '100,000+ Spatial Nodes'}</div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => navigateTo({ view: 'software', id: soft.id })}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span>Detailed Showcase Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openLeadModal({ softwareInterest: soft.name, inquiryType: 'Software Demo' })}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
                    >
                      Request Demo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
