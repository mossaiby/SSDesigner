import React, { useMemo, useState } from 'react';
import { InlineMath as ReactKatexInline, BlockMath as ReactKatexBlock } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Copy, Check, Code, Sigma, Sparkles } from 'lucide-react';

interface MathRendererProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Clean surrounding math delimiters ($$, $, \[, \], \(, \))
 * so react-katex receives pure TeX syntax.
 */
export const cleanTex = (tex: string): string => {
  if (!tex) return '';
  let clean = tex.trim();
  
  if (clean.startsWith('$$') && clean.endsWith('$$') && clean.length >= 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('$') && clean.endsWith('$') && clean.length >= 2) {
    clean = clean.slice(1, -1).trim();
  } else if (clean.startsWith('\\[') && clean.endsWith('\\]') && clean.length >= 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\\(') && clean.endsWith('\\)') && clean.length >= 4) {
    clean = clean.slice(2, -2).trim();
  }
  
  return clean;
};

/**
 * High-quality Inline Math component using react-katex.
 */
export const InlineMath: React.FC<{ math: string; className?: string }> = ({ math, className = '' }) => {
  const clean = cleanTex(math);

  return (
    <span className={`inline-math-container inline-block align-baseline px-1 text-slate-900 dark:text-cyan-200 ${className}`}>
      <ReactKatexInline
        math={clean}
        renderError={(error) => (
          <code className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-200 dark:border-amber-900">
            {math}
          </code>
        )}
      />
    </span>
  );
};

/**
 * High-quality Block Math component using react-katex.
 */
export const BlockMath: React.FC<{ math: string; className?: string }> = ({ math, className = '' }) => {
  const clean = cleanTex(math);

  return (
    <div className={`block-math-container my-4 p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 overflow-x-auto text-slate-950 dark:text-cyan-100 text-center shadow-xs transition-colors ${className}`}>
      <ReactKatexBlock
        math={clean}
        renderError={(error) => (
          <div className="text-left font-mono text-xs text-rose-600 dark:text-rose-400 p-2 bg-rose-50 dark:bg-rose-950/30 rounded border border-rose-200 dark:border-rose-900">
            <span>Formula parse warning: {error.message}</span>
            <pre className="mt-1 text-[11px] text-slate-700 dark:text-slate-300">{math}</pre>
          </div>
        )}
      />
    </div>
  );
};

/**
 * Standalone Math Card with Title, react-katex rendered formula,
 * and LaTeX Source Inspection & Copy functionality for documentation.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ 
  formula, 
  displayMode = true,
  className = '' 
}) => {
  const [showRawTex, setShowRawTex] = useState(false);
  const [copied, setCopied] = useState(false);

  const { title, mathPart } = useMemo(() => {
    const trimmed = formula.trim();
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      const prefix = trimmed.slice(0, colonIndex);
      // Ensure prefix doesn't look like LaTeX (\colon, \matrix, etc.)
      if (!prefix.includes('\\') && !prefix.includes('$') && prefix.length < 80) {
        return {
          title: prefix.trim(),
          mathPart: trimmed.slice(colonIndex + 1).trim(),
        };
      }
    }
    return { title: null, mathPart: trimmed };
  }, [formula]);

  const clean = cleanTex(mathPart);

  const handleCopy = () => {
    navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700 ${className}`}>
      {/* Header bar with title and action buttons */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400">
            <Sigma className="w-3.5 h-3.5" />
          </div>
          {title ? (
            <span className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-cyan-300 font-semibold truncate">
              {title}
            </span>
          ) : (
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Governing Equation
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowRawTex(!showRawTex)}
            className="px-2 py-1 rounded text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            title="Toggle raw LaTeX notation"
          >
            <Code className="w-3 h-3" />
            <span className="hidden sm:inline">{showRawTex ? 'Rendered' : 'TeX Code'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy LaTeX formula to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Formula Content Area */}
      {showRawTex ? (
        <div className="p-3 rounded-xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
          <pre>{clean}</pre>
        </div>
      ) : (
        <div className="overflow-x-auto text-slate-950 dark:text-cyan-100 py-2 leading-relaxed">
          {displayMode ? (
            <ReactKatexBlock
              math={clean}
              renderError={(error) => (
                <code className="text-xs font-mono text-cyan-600 dark:text-cyan-300">
                  {mathPart}
                </code>
              )}
            />
          ) : (
            <ReactKatexInline
              math={clean}
              renderError={(error) => (
                <code className="text-xs font-mono text-cyan-600 dark:text-cyan-300">
                  {mathPart}
                </code>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Parses inline text with react-katex support for:
 * - $math$ (KaTeX InlineMath)
 * - **bold text**
 * - *italic text*
 * - `inline code`
 * - [link text](url)
 */
export const renderInlineMarkdownAndMath = (text: string, keyPrefix: string = 'inl'): React.ReactNode[] => {
  const tokenRegex = /(\$[^\$\n]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`|\[[^\]]+\]\([^)]+\))/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  const nodes: React.ReactNode[] = [];
  let tokenIdx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`${keyPrefix}-t-${tokenIdx}-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    const raw = match[0];
    if (raw.startsWith('$') && raw.endsWith('$')) {
      const mathContent = raw.slice(1, -1);
      nodes.push(
        <InlineMath
          key={`${keyPrefix}-m-${tokenIdx}`}
          math={mathContent}
        />
      );
    } else if (raw.startsWith('**') && raw.endsWith('**')) {
      const boldContent = raw.slice(2, -2);
      nodes.push(
        <strong key={`${keyPrefix}-b-${tokenIdx}`} className="font-bold text-slate-950 dark:text-white">
          {renderInlineMarkdownAndMath(boldContent, `${keyPrefix}-b-${tokenIdx}`)}
        </strong>
      );
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      const italicContent = raw.slice(1, -1);
      nodes.push(
        <em key={`${keyPrefix}-i-${tokenIdx}`} className="italic text-slate-800 dark:text-slate-200">
          {renderInlineMarkdownAndMath(italicContent, `${keyPrefix}-i-${tokenIdx}`)}
        </em>
      );
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      const codeContent = raw.slice(1, -1);
      nodes.push(
        <code
          key={`${keyPrefix}-c-${tokenIdx}`}
          className="px-1.5 py-0.5 rounded font-mono text-xs bg-slate-200/80 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-slate-300 dark:border-slate-700"
        >
          {codeContent}
        </code>
      );
    } else if (raw.startsWith('[')) {
      const closeBracket = raw.indexOf(']');
      const linkText = raw.slice(1, closeBracket);
      const url = raw.slice(closeBracket + 2, -1);
      nodes.push(
        <a
          key={`${keyPrefix}-a-${tokenIdx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:text-cyan-500 font-medium"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + raw.length;
    tokenIdx++;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <span key={`${keyPrefix}-t-end-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return nodes;
};

/**
 * Formats a block of text that may contain markdown bold, inline math ($...$),
 * and block math ($$...$$) using react-katex.
 */
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const elements = useMemo(() => {
    if (!text) return null;
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let blockIdx = 0;

    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = text.slice(lastIndex, match.index);
        parts.push(
          <span key={`prev-${blockIdx}`}>
            {renderInlineMarkdownAndMath(textSegment, `blk-prev-${blockIdx}`)}
          </span>
        );
      }

      const mathBlock = match[1];
      parts.push(
        <BlockMath key={`blk-${blockIdx}`} math={mathBlock} />
      );

      lastIndex = match.index + match[0].length;
      blockIdx++;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key="end">
          {renderInlineMarkdownAndMath(text.slice(lastIndex), 'blk-end')}
        </span>
      );
    }

    return parts;
  }, [text]);

  return <span className={className}>{elements}</span>;
};

/**
 * Full Markdown + react-katex Article Renderer for Technical Blog Posts,
 * Case Studies, and Long-form Engineering Documentation.
 *
 * Supports:
 * - Block math: $$ ... $$ (single & multi-line)
 * - Inline math: $ ... $
 * - Markdown Headers with math: #, ##, ###, ####
 * - Code blocks: ```language ... ``` with copy button
 * - Markdown tables with math inside table cells
 * - Blockquotes with math: > ...
 * - Ordered & Unordered lists with math: -, *, 1. 2.
 */
export const MarkdownArticleView: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const blocks = useMemo(() => {
    if (!content) return [];
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const parsedBlocks: React.ReactNode[] = [];
    let i = 0;
    let blockKey = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Code Block: ```language
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim() || 'plaintext';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length && lines[i].trim().startsWith('```')) {
          i++; // Skip closing ```
        }
        const fullCode = codeLines.join('\n');
        const currentCodeIdx = blockKey++;

        parsedBlocks.push(
          <div key={`code-${currentCodeIdx}`} className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
              <span className="text-cyan-400 font-semibold uppercase text-[11px]">{lang}</span>
              <button
                onClick={() => handleCopyCode(fullCode, currentCodeIdx)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                {copiedBlock === currentCodeIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Block math: $$ ... $$
      if (line.trim().startsWith('$$')) {
        let mathContent = '';
        if (line.trim().endsWith('$$') && line.trim().length > 2) {
          mathContent = line.trim().slice(2, -2).trim();
          i++;
        } else {
          mathContent = line.trim().slice(2) + '\n';
          i++;
          while (i < lines.length && !lines[i].trim().endsWith('$$')) {
            mathContent += lines[i] + '\n';
            i++;
          }
          if (i < lines.length) {
            mathContent += lines[i].trim().slice(0, -2);
            i++;
          }
        }

        parsedBlocks.push(
          <BlockMath key={`math-block-${blockKey++}`} math={mathContent.trim()} />
        );
        continue;
      }

      // Markdown Tables (| Col 1 | Col 2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const parseRow = (rowStr: string) =>
            rowStr.slice(1, -1).split('|').map(c => c.trim());

          const headerCols = parseRow(tableLines[0]);
          const isSeparator = /^[\s|:-]+$/.test(tableLines[1]);
          const dataRows = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

          parsedBlocks.push(
            <div key={`table-${blockKey++}`} className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/80">
                  <tr>
                    {headerCols.map((col, cIdx) => (
                      <th key={cIdx} className="px-4 py-3 text-left font-mono font-bold text-slate-900 dark:text-cyan-300 uppercase tracking-wider">
                        {renderInlineMarkdownAndMath(col, `th-${blockKey}-${cIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {dataRows.map((rStr, rIdx) => {
                    const cells = parseRow(rStr);
                    return (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        {cells.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                            {renderInlineMarkdownAndMath(cell, `td-${blockKey}-${rIdx}-${cellIdx}`)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Headings with inline math support
      if (line.startsWith('#### ')) {
        parsedBlocks.push(
          <h4 key={`block-${blockKey++}`} className="text-lg font-bold text-slate-950 dark:text-white tracking-tight mt-6 mb-2">
            {renderInlineMarkdownAndMath(line.slice(5), `h4-${blockKey}`)}
          </h4>
        );
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        parsedBlocks.push(
          <h3 key={`block-${blockKey++}`} className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mt-8 mb-3">
            {renderInlineMarkdownAndMath(line.slice(4), `h3-${blockKey}`)}
          </h3>
        );
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        parsedBlocks.push(
          <h2 key={`block-${blockKey++}`} className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight mt-10 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            {renderInlineMarkdownAndMath(line.slice(3), `h2-${blockKey}`)}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith('# ')) {
        parsedBlocks.push(
          <h1 key={`block-${blockKey++}`} className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-10 mb-4">
            {renderInlineMarkdownAndMath(line.slice(2), `h1-${blockKey}`)}
          </h1>
        );
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        parsedBlocks.push(
          <hr key={`block-${blockKey++}`} className="my-8 border-slate-200 dark:border-slate-800" />
        );
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2));
          i++;
        }
        parsedBlocks.push(
          <blockquote
            key={`block-${blockKey++}`}
            className="my-4 p-4 border-l-4 border-cyan-500 bg-slate-50 dark:bg-slate-900/60 rounded-r-xl italic text-slate-700 dark:text-slate-300"
          >
            {renderInlineMarkdownAndMath(quoteLines.join(' '), `quote-${blockKey}`)}
          </blockquote>
        );
        continue;
      }

      // Unordered list (- or *)
      if (/^[-*]\s+/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^[-*]\s+/, ''));
          i++;
        }
        parsedBlocks.push(
          <ul key={`block-${blockKey++}`} className="my-4 space-y-2.5 list-disc pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            {listItems.map((itemText, idx) => (
              <li key={idx} className="marker:text-cyan-500">
                {renderInlineMarkdownAndMath(itemText, `ul-${blockKey}-${idx}`)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list (1. 2. 3.)
      if (/^\d+\.\s+/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
          i++;
        }
        parsedBlocks.push(
          <ol key={`block-${blockKey++}`} className="my-4 space-y-2.5 list-decimal pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            {listItems.map((itemText, idx) => (
              <li key={idx} className="marker:text-cyan-600 dark:marker:text-cyan-400 marker:font-semibold">
                {renderInlineMarkdownAndMath(itemText, `ol-${blockKey}-${idx}`)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Regular paragraph
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith('#') &&
        !lines[i].trim().startsWith('$$') &&
        !lines[i].trim().startsWith('```') &&
        !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) &&
        !lines[i].startsWith('> ') &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^(\*\*\*|---|___)$/.test(lines[i].trim())
      ) {
        paragraphLines.push(lines[i]);
        i++;
      }

      parsedBlocks.push(
        <p key={`block-${blockKey++}`} className="text-slate-700 dark:text-slate-300 leading-relaxed my-3.5">
          {renderInlineMarkdownAndMath(paragraphLines.join(' '), `p-${blockKey}`)}
        </p>
      );
    }

    return parsedBlocks;
  }, [content, copiedBlock]);

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
};
