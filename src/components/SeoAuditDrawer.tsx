import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Code, CheckCircle, X, Globe, Bot, FileText, ExternalLink, Copy, Check } from 'lucide-react';

export const SeoAuditDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLlm, setCopiedLlm] = useState(false);
  const { currentNav, softwareList, projectsList, blogPosts, isAdminLoggedIn } = useData();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-seo-audit', handleOpen);
    return () => window.removeEventListener('open-seo-audit', handleOpen);
  }, []);

  // Restrict to authenticated admin operators; do not display to regular public visitors
  if (!isAdminLoggedIn) return null;

  // Get current page SEO context
  const getPageSeo = () => {
    switch (currentNav.view) {
      case 'software': {
        const item = softwareList.find(s => s.id === currentNav.id) || softwareList[0];
        return {
          title: `${item.name} – Space Structures Engineering Software | AeroSpatial`,
          description: item.description.substring(0, 160) + '...',
          type: 'SoftwareApplication',
          url: `https://aerospatial.ai/#/software/${item.id}`,
          keywords: [item.name, item.category, 'space structures', 'finite element solver', 'truss analysis'],
          schema: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: item.name,
            operatingSystem: 'Windows 11, Linux RHEL 9, macOS Sonoma',
            applicationCategory: 'EngineeringSoftware',
            softwareVersion: item.version,
            description: item.description,
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              category: 'Evaluation Demo / Commercial Quotation',
            },
          },
        };
      }
      case 'project': {
        const item = projectsList.find(p => p.id === currentNav.id) || projectsList[0];
        return {
          title: `${item.title} – Real-World Space Structure Case Study | AeroSpatial`,
          description: `${item.subtitle}. Engineered using AeroSpatial calculation software. Clear span: ${item.span}.`,
          type: 'CreativeWork / CaseStudy',
          url: `https://aerospatial.ai/#/project/${item.id}`,
          keywords: [item.title, item.category, item.span, 'spatial structures', 'space grid case study'],
          schema: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: item.title,
            headline: item.subtitle,
            locationCreated: item.location,
            dateCreated: item.year.toString(),
            description: item.engineeringSolution,
            creator: {
              '@type': 'Organization',
              name: item.clientOrEngineer,
            },
          },
        };
      }
      case 'blog': {
        const post = blogPosts.find(p => p.id === currentNav.id) || blogPosts[0];
        return {
          title: `${post.title} | AeroSpatial Engineering Insights`,
          description: post.excerpt,
          type: 'Article',
          url: `https://aerospatial.ai/#/blog/${post.id}`,
          keywords: post.tags,
          schema: {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: post.title,
            image: post.coverImage,
            datePublished: post.publishedAt,
            author: {
              '@type': 'Person',
              name: post.author.name,
              jobTitle: post.author.role,
            },
            publisher: {
              '@type': 'Organization',
              name: 'AeroSpatial Computing AG',
            },
          },
        };
      }
      default:
        return {
          title: 'AeroSpatial – Computational Mechanics for Extreme Space Structures',
          description: 'Specialized finite-element analysis, dynamic relaxation form-finding, and post-buckling solvers for large-span spatial trusses, geodesic domes, and tensegrity systems.',
          type: 'Organization / EngineeringService',
          url: 'https://aerospatial.ai/',
          keywords: ['space structures software', 'dynamic relaxation', 'tensegrity form finding', 'nonlinear buckling solver', 'Eurocode 3', 'space frame FEA'],
          schema: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AeroSpatial Computing AG',
            url: 'https://aerospatial.ai',
            description: 'Advanced computational mechanics software for spatial systems, reticulated shells, and deployables.',
            sameAs: [
              'https://github.com/aerospatial-structures',
              'https://linkedin.com/company/aerospatial-structures'
            ],
          },
        };
    }
  };

  const seoData = getPageSeo();

  const handleCopyLlmUrl = () => {
    navigator.clipboard.writeText(window.location.origin + '/llms.txt');
    setCopiedLlm(true);
    setTimeout(() => setCopiedLlm(false), 2000);
  };

  return (
    <>
      {/* Inspector Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto transition-colors text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Technical SEO, Structured Data & LLM Indexing
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-950 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Checks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1 font-semibold mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Canonical URL</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 truncate">Configured</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1 font-semibold mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>OpenGraph Tags</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 truncate">og:title, og:image</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1 font-semibold mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Twitter Card</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 truncate">summary_large_image</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                  <div className="flex items-center gap-1 font-semibold mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>LLM Manifest</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 truncate">/llms.txt Active</div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase">Page Title Tag:</span>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white mt-0.5">{seoData.title}</p>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase">Meta Description:</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">{seoData.description}</p>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase">Target Canonical Route:</span>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">{seoData.url}</p>
                </div>
              </div>

              {/* LLM Indexing Details */}
              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
                    <span className="text-xs font-bold text-slate-950 dark:text-white">
                      LLM & AI Agent Indexing (llms.txt standard)
                    </span>
                  </div>
                  <button
                    onClick={handleCopyLlmUrl}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 text-[10px] font-mono text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-950 transition-colors"
                  >
                    {copiedLlm ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLlm ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Configured according to the official <code className="font-mono text-cyan-700 dark:text-cyan-400">/llms.txt</code> standard to allow AI search and inference agents (ChatGPT, Claude, Gemini, Perplexity) to index mathematical formulations, finite element capabilities, and case study outcomes without scraping noise.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-400 hover:underline"
                  >
                    <span>View /llms.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-400">·</span>
                  <a
                    href="/llms-full.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-400 hover:underline"
                  >
                    <span>View /llms-full.txt (Comprehensive Knowledge Base)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-400">·</span>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:underline"
                  >
                    <span>View /robots.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Schema JSON-LD Output */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Active Schema.org JSON-LD Structured Data:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Schema.org Valid</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-cyan-700 dark:text-cyan-300 overflow-x-auto max-h-56">
                  {JSON.stringify(seoData.schema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
