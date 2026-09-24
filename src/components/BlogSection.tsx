import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { FormattedMathText } from './MathRenderer';

interface BlogSectionProps {
  isStandalonePage?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ isStandalonePage = false }) => {
  const { blogPosts, navigateTo } = useData();

  return (
    <section className={`py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors ${isStandalonePage ? 'min-h-screen' : 'border-b border-slate-200 dark:border-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
            <span>Research & Industry Whitepapers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-4">
            Technical Insights in Spatial Mechanics
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300 font-normal">
            Deep-dives into nonlinear structural analysis, tensegrity prestress stability, and computational geometry by our structural engineering research group.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {blogPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Research Articles Published Yet</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Engineering whitepapers, mathematical formulations, and dynamic relaxation research will appear here once published.
            </p>
            <button
              onClick={() => navigateTo({ view: 'admin' })}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-md cursor-pointer"
            >
              Publish Article in Admin Console
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <article
                key={post.id}
                onClick={() => navigateTo({ view: 'blog', id: post.id })}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-cyan-500 transition-all hover:shadow-xl shadow-sm cursor-pointer"
              >
                <div>
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-800 text-[11px] font-mono text-cyan-300">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                      <FormattedMathText text={post.title} />
                    </h3>
                    <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                      <FormattedMathText text={post.excerpt} />
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-700 dark:text-slate-300 font-semibold font-mono">
                      {post.author.name[0]}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{post.author.name}</span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-mono">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
