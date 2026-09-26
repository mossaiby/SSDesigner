import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight } from 'lucide-react';
import { SoftwareGalleryWidget } from './SoftwareGalleryWidget';

export const Hero: React.FC = () => {
  const { navigateTo, openLeadModal } = useData();

  return (
    <section className="relative overflow-hidden bg-slate-100/60 dark:bg-slate-950 pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200 dark:border-slate-900 transition-colors">
      {/* Blueprint grid subtle background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-40 pointer-events-none" />

      {/* Atmospheric lighting gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 dark:from-cyan-950/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Headline Block */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1] text-balance">
            Computational Solvers for Extreme <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500 dark:from-cyan-400 dark:to-sky-300">Space Structures</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Specialized finite-element analysis, dynamic relaxation form-finding, snap-through buckling solvers, and robotic CAM for large-span spatial trusses, geodesic domes, tensegrity roofs, and reticulated shells.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo({ view: 'all_software' })}
              className="px-6 py-3 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-950/20 flex items-center gap-2 cursor-pointer"
            >
              <span>View Full Software Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openLeadModal({ inquiryType: 'Software Demo' })}
              className="px-6 py-3 text-xs font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              Request Technical Evaluation
            </button>
          </div>
        </div>

        {/* Page-Width Software Showcase Gallery Widget */}
        <div className="w-full">
          <SoftwareGalleryWidget />
        </div>
      </div>
    </section>
  );
};
