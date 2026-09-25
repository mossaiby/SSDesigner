import React from 'react';
import { useData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const { navigateTo, softwareList, projectsList } = useData();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
              SSDesigner
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
            Advanced computational mechanics for space structures. Form-finding, geometric nonlinearities, and tensegrity equilibrium software for extreme civil engineering.
          </p>

          <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Engineered in Compliance with:</div>
            <div>· Eurocode 3 (EN 1993-1-1 / EN 1993-1-11)</div>
            <div>· IASS Spatial Structures Recommendations</div>
            <div>· ASCE/SEI 7-22 Wind & Seismic Load Formulations</div>
          </div>
        </div>

        {/* Software Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Software</h4>
          <ul className="space-y-2">
            {softwareList.map(s => (
              <li key={s.id}>
                <button
                  onClick={() => navigateTo({ view: 'software', id: s.id })}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Projects</h4>
          <ul className="space-y-2">
            {projectsList.map(p => (
              <li key={p.id}>
                <button
                  onClick={() => navigateTo({ view: 'project', id: p.id })}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-left truncate max-w-[180px] block"
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* System & Support Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Resources & Support</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigateTo({ view: 'all_blog' })}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                Insights
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ view: 'contact' })}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-900/80 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
        <div>
          © 2026 SSDesigner (ssdesigner.ir). All rights reserved.
        </div>
      </div>
    </footer>
  );
};
