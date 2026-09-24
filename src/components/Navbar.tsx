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
            className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white px-2 py-1 rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all whitespace-nowrap"
          >
            SSDesigner
          </button>
          <span className="hidden lg:inline text-[11px] font-mono text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40">
            Space Structures FEM
          </span>
        </div>

        {/* Zone 2: 4–6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-xs">
          <button
            onClick={() => handleNavClick('all_software')}
            className={getNavLinkClass(currentNav.view === 'all_software' || currentNav.view === 'software')}
          >
            Software Suite
          </button>
          <button
            onClick={() => handleNavClick('all_projects')}
            className={getNavLinkClass(currentNav.view === 'all_projects' || currentNav.view === 'project')}
          >
            Real-World Projects
          </button>
          <button
            onClick={() => handleNavClick('all_blog')}
            className={getNavLinkClass(currentNav.view === 'all_blog' || currentNav.view === 'blog')}
          >
            Technical Insights
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={getNavLinkClass(currentNav.view === 'contact')}
          >
            Engineering Contact
          </button>
        </nav>

        {/* Zone 3: 1–2 primary actions + theme & admin toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scientific Calculator & Unit Converter Button */}
          <button
            onClick={openCalcSidebar}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Scientific Calculator & Engineering Unit Converter"
            aria-label="Calculator & Unit Converter"
          >
            <Calculator className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden lg:inline text-xs font-mono font-medium">Calc & Units</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>

          {/* Admin Operator Portal Button */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
              isAdminLoggedIn 
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300' 
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950'
            }`}
            title={isAdminLoggedIn ? `Admin: ${currentUser?.name} (${currentUser?.role})` : 'Operator Admin Portal'}
            aria-label="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4" />
            {isAdminLoggedIn && (
              <span className="hidden xl:inline text-[11px] font-mono uppercase">
                {currentUser?.role === 'administrator' ? 'Admin' : 'Operator'}
              </span>
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
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-900 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all"
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
            Software Suite
          </button>
          <button
            onClick={() => handleNavClick('all_projects')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'all_projects')}`}
          >
            Real-World Projects
          </button>
          <button
            onClick={() => handleNavClick('all_blog')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'all_blog')}`}
          >
            Technical Insights
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'contact')}`}
          >
            Engineering Contact
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className={`block w-full text-left ${getNavLinkClass(currentNav.view === 'admin')}`}
          >
            Admin Operator Console
          </button>
          <button
            onClick={() => {
              openCalcSidebar();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between"
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
