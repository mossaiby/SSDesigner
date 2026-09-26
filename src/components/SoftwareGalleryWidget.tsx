import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Layers, 
  Compass, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { SoftwareItem } from '../types';
import { INITIAL_SOFTWARE_ITEMS } from '../data/initialData';

export const SoftwareGalleryWidget: React.FC = () => {
  const { softwareList, navigateTo, openLeadModal, openGalleryModal, isAdminLoggedIn } = useData();

  if (!Array.isArray(softwareList) || softwareList.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-8 sm:p-12 text-center max-w-3xl mx-auto backdrop-blur-sm shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
          <Cpu className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">Computational Solvers Matrix</h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          {isAdminLoggedIn
            ? 'No calculation engines are currently published. Structural engineers and operators can configure, benchmark, and publish proprietary finite element solvers in the Admin Console.'
            : 'Explore our specialized dynamic relaxation, non-linear FEM, and parametric space structure calculation engines. Contact our engineering team for customized benchmark runs and solver licenses.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAdminLoggedIn && (
            <button
              onClick={() => navigateTo({ view: 'admin' })}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
            >
              Manage Software in Admin Console
            </button>
          )}
          <button
            onClick={() => openLeadModal({ inquiryType: 'Software Demo' })}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
          >
            Request Technical Evaluation
          </button>
          <button
            onClick={() => openLeadModal({ inquiryType: 'Consulting / Engineering Partnership' })}
            className="px-5 py-2.5 text-xs font-medium rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Inquire About Custom Solvers
          </button>
        </div>
      </div>
    );
  }

  const validSoftwareList: SoftwareItem[] = softwareList;

  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string>(
    validSoftwareList[0]?.id || ''
  );
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const selectedSoftware: SoftwareItem = 
    validSoftwareList.find(s => s && s.id === selectedSoftwareId) || validSoftwareList[0];

  // Dynamic categories list from softwareList
  const uniqueCategories = Array.from(new Set(validSoftwareList.map(s => s?.category).filter(Boolean)));

  // Filtering
  const filteredSoftware = validSoftwareList.filter(item => {
    if (!item) return false;
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleNext = () => {
    const currentIndex = validSoftwareList.findIndex(s => s?.id === selectedSoftware.id);
    const nextIndex = (currentIndex + 1) % validSoftwareList.length;
    setSelectedSoftwareId(validSoftwareList[nextIndex]?.id || validSoftwareList[0]?.id);
  };

  const handlePrev = () => {
    const currentIndex = validSoftwareList.findIndex(s => s?.id === selectedSoftware.id);
    const prevIndex = (currentIndex - 1 + validSoftwareList.length) % validSoftwareList.length;
    setSelectedSoftwareId(validSoftwareList[prevIndex]?.id || validSoftwareList[0]?.id);
  };

  const currentThumbnail = selectedSoftware?.thumbnail || '';
  const currentFeatures = Array.isArray(selectedSoftware?.keyFeatures) ? selectedSoftware.keyFeatures : [];
  const currentSpecs = selectedSoftware?.specs || {
    solverType: '',
    formulation: '',
    elementsSupported: [],
    maxNodesTested: '',
    fileIOFormats: [],
    hardwareAcceleration: '',
    complianceStandards: []
  };

  return (
    <div className="w-full">
      {/* Top Controls & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
              Proprietary Computational Suite
            </h2>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Specialized Solvers for Space & Tensile Structures
          </p>
        </div>

        {/* Filter Pills dynamically derived from software categories */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-xs ${
              selectedFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            All ({validSoftwareList.length})
          </button>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                selectedFilter === cat
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panoramic Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl mb-8 group">
        {/* Background Image with Gradient Overlay */}
        <div className="relative aspect-21/9 min-h-[360px] max-h-[480px] w-full overflow-hidden">
          <img
            src={currentThumbnail}
            alt={selectedSoftware?.name || ''}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle blueprint dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4" />

          {/* Foreground Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
            {/* Top Row Badges & Carousel Arrows */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500 text-slate-950 shadow-sm">
                  {selectedSoftware?.version || ''}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800/90 text-cyan-300 border border-slate-700/80 backdrop-blur-xs">
                  {selectedSoftware?.category || 'General'}
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono bg-slate-900/80 text-slate-300 border border-slate-700/80">
                  {currentSpecs?.solverType || ''}
                </span>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 transition-colors backdrop-blur-xs cursor-pointer"
                  title="Previous Engine"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 transition-colors backdrop-blur-xs cursor-pointer"
                  title="Next Engine"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle / Bottom Software Info */}
            <div className="max-w-2xl space-y-3 pt-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {selectedSoftware?.name || ''}
              </h3>
              
              <p className="text-cyan-300 font-mono text-xs sm:text-sm font-medium">
                {selectedSoftware?.tagline || ''}
              </p>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
                {selectedSoftware?.description || ''}
              </p>

              {/* Key Highlights Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {currentFeatures.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] text-slate-200 backdrop-blur-xs font-mono">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate max-w-[240px]">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => selectedSoftware && navigateTo({ view: 'software', id: selectedSoftware.id })}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer"
                >
                  <span>Launch Engine Specs & TeX</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openLeadModal({ softwareInterest: selectedSoftware?.name, inquiryType: 'Software Demo' })}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-700 font-medium text-xs transition-colors backdrop-blur-xs cursor-pointer"
                >
                  Request Technical Evaluation
                </button>

                <button
                  onClick={() => selectedSoftware && openGalleryModal(selectedSoftware.id, 'software', selectedSoftware.name)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900/80 text-cyan-400 hover:text-white border border-slate-800 text-xs transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
                  title="View Simulation Renders & Videos"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">CAD & Simulation Media</span>
                </button>
              </div>
            </div>

            {/* Bottom Stepper Dots */}
            <div className="flex items-center gap-1.5 pt-4">
              {validSoftwareList.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSoftwareId(s.id)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    s.id === selectedSoftware.id
                      ? 'w-8 bg-cyan-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Select ${s.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page-Width Software Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSoftware.map(software => {
          if (!software) return null;
          const isSelected = software.id === selectedSoftware?.id;
          const itemThumbnail = software.thumbnail || '';
          const itemSpecs = software.specs;

          return (
            <div
              key={software.id}
              onClick={() => setSelectedSoftwareId(software.id)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 cursor-pointer ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-950/10 -translate-y-1'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-lg'
              }`}
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
                <img
                  src={itemThumbnail}
                  alt={software.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                
                {/* Category chip over image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-900/90 text-cyan-300 border border-slate-700 backdrop-blur-xs">
                    {software.category || ''}
                  </span>
                </div>

                {/* Version badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500 text-slate-950 font-bold">
                    {(software.version || '').split(' ')[0]}
                  </span>
                </div>

                {/* Software title on image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {software.name}
                  </h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {software.tagline || ''}
                </p>

                {/* Technical specs teaser */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 font-medium">
                    <span>Capacity:</span>
                    <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[140px]">
                      {itemSpecs.maxNodesTested || ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 font-medium">
                    <span>Acceleration:</span>
                    <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                      CUDA / Metal
                    </span>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo({ view: 'software', id: software.id });
                    }}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 group-hover:underline cursor-pointer"
                  >
                    <span>View Solver Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openGalleryModal(software.id, 'software', software.name);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View Renders & Media"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
