import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Sun, Moon, ShieldCheck, Menu, X, Calculator } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    isDark, 
    toggleDarkMode, 
    currentNav, 
    navigateTo, 
    openLeadModal, 
    isAdminLoggedIn, 
    currentUser,
    openCalcSidebar 
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: any, id?: string) => {
    navigateTo({ view, id });
    setMobileMenuOpen(false);
  };

  // Nav link style:
  // - In light mode hover: dark background with light text (hover:bg-slate-900 hover:text-white)
  // - In dark mode hover: highlighted background with dark text (dark:hover:bg-cyan-400 dark:hover:text-slate-950)
  const getNavLinkClass = (isActive: boolean) => `
    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
    hover:bg-slate-900 hover:text-white
    dark:hover:bg-cyan-400 dark:hover:text-slate-950
    ${isActive 
      ? 'bg-slate-900 text-white font-semibold dark:bg-cyan-400/20 dark:text-cyan-300' 
      : 'text-slate-700 dark:text-slate-300'
    }
  `.trim();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white px-2.5 py-1 rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all whitespace-nowrap group"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <img src="favicon-16x16.png"></img>
            </div>
            <span>SSDesigner</span>
          </button>
        </div>

        {/* Zone 2: 4–6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-xs">
          <button
            onClick={() => handleNavClick('all_software')}
            className={getNavLinkClass(currentNav.view === 'all_software' || currentNav.view === 'software')}
          >
            Software
          </button>
          <button
            onClick={() => handleNavClick('all_projects')}
            className={getNavLinkClass(currentNav.view === 'all_projects' || currentNav.view === 'project')}
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('all_blog')}
            className={getNavLinkClass(currentNav.view === 'all_blog' || currentNav.view === 'blog')}
          >
            Insights
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={getNavLinkClass(currentNav.view === 'contact')}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1–2 primary actions + theme & admin toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scientific Calculator & Unit Converter Button */}
          <button
            onClick={openCalcSidebar}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:border-cyan-800/80 dark:hover:text-cyan-300 transition-colors cursor-pointer group"
            title="Scientific Calculator & Engineering Unit Converter"
            aria-label="Calculator & Unit Converter"
          >
            <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-700 dark:hover:text-white transition-colors cursor-pointer group"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => openLeadModal({ inquiryType: 'Software Demo' })}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors whitespace-nowrap shadow-sm shadow-cyan-950/20"
          >
            Request Demo
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2 text-xs transition-colors">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'home')}`}
          >
            Home Overview
          </button>
          <button
            onClick={() => handleNavClick('all_software')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'all_software')}`}
          >
            Software
          </button>
          <button
            onClick={() => handleNavClick('all_projects')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'all_projects')}`}
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('all_blog')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'all_blog')}`}
          >
            Insights
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'contact')}`}
          >
            Contact
          </button>
          <button
            onClick={() => {
              openCalcSidebar();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5" />
              Calculator & Unit Converter
            </span>
            <span className="text-[10px] font-mono">Open Tool &rarr;</span>
          </button>
        </div>
      )}
    </header>
  );
};
