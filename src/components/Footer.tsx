import React from 'react';
import { useData } from '../context/DataContext';
import { ShieldCheck, Bot, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, softwareList, projectsList, isAdminLoggedIn } = useData();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-slate-950 dark:text-white tracking-tight">
              SSDesigner
            </span>
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-900/50">
              FEM Solvers
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
            Advanced computational mechanics for space structures. Form-finding, geometric nonlinearities, and tensegrity equilibrium software for extreme civil and aerospace engineering.
          </p>

          <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Engineered in Compliance with:</div>
            <div>· Eurocode 3 (EN 1993-1-1 / EN 1993-1-11)</div>
            <div>· IASS Spatial Structures Recommendations</div>
            <div>· ASCE/SEI 7-22 Wind & Seismic Load Formulations</div>
          </div>
        </div>

        {/* Software Suite Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Engineering Software</h4>
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

        {/* Real-World Projects */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Real-World Case Studies</h4>
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

        {/* Portal & Administration & LLM Index */}
        <div>
          <h4 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">Platform Operations</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigateTo({ view: 'all_blog' })}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                Technical Blog
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ view: 'contact' })}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                Lead & Inquiry Desk
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo({ view: 'admin' })}
                className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-400"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console {isAdminLoggedIn ? '(Active)' : ''}</span>
              </button>
            </li>
            <li className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-400 hover:underline"
                title="Machine-Readable LLM Knowledge Index (llms.txt standard)"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>LLM Knowledge Index (llms.txt)</span>
              </a>
            </li>
            <li>
              <a
                href="/llms-full.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300"
                title="Full Deep Research LLM Documentation (llms-full.txt)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Agent Manifest (llms-full.txt)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
        <div>
          © 2026 SSDesigner (ssdesigner.ir). All mathematical rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Precision Non-Linear Mechanics</span>
          <span>·</span>
          <span className="text-cyan-700 dark:text-cyan-400 font-semibold">Spatial Equilibrium Verified</span>
        </div>
      </div>
    </footer>
  );
};
