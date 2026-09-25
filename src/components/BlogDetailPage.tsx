import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { FormattedMathText, MarkdownArticleView } from './MathRenderer';
import { INITIAL_BLOG_POSTS } from '../data/initialData';

interface BlogDetailPageProps {
  postId: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ postId }) => {
  const { blogPosts, navigateTo, openLeadModal } = useData();

  const post = blogPosts.find(p => p.id === postId) || blogPosts[0] || INITIAL_BLOG_POSTS[0];

  useEffect(() => {
    document.title = `${post.title} – Engineering Insights | SSDesigner`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post]);

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigateTo({ view: 'all_blog' })}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Insights
        </button>
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
          <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{post.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-6 text-balance">
          {post.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 py-4 border-y border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-sm font-bold text-cyan-700 dark:text-cyan-400 font-mono">
            {post.author.name[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950 dark:text-white">{post.author.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{post.author.role}</div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
        <div className="aspect-video max-h-[460px] w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base">
        <p className="text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic border-l-2 border-cyan-500 pl-4 bg-slate-100/50 dark:bg-slate-900/40 py-2 rounded-r-xl">
          <FormattedMathText text={post.excerpt} />
        </p>

        <MarkdownArticleView content={post.content} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="max-w-3xl mx-auto mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 mr-2">Keywords:</span>
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 px-2.5 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto mt-16 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
          Validate Your Spatial Geometry with Our Solvers
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6">
          Schedule a technical benchmark session with our engineering core to test your tensegrity or spatial grid models.
        </p>
        <button
          onClick={() => openLeadModal({ inquiryType: 'Software Demo' })}
          className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
        >
          Request Technical Evaluation
        </button>
      </div>
    </article>
  );
};
