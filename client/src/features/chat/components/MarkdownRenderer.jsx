import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * MarkdownRenderer
 *
 * Renders AI markdown responses with:
 *  - GitHub-flavoured markdown (tables, task lists, strikethrough)
 *  - Syntax-highlighted code blocks (Prism / oneDark theme)
 *  - Inline code styling
 *  - Tailwind-based typography for paragraphs, lists, links, etc.
 *
 * Props:
 *   content  – the raw markdown string to render
 */
const MarkdownRenderer = ({ content = '' }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{

        /* ── Code blocks & inline code ─────────────────────────── */
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const codeString = String(children).replace(/\n$/, '');

          // React-Markdown v9+ removed the `inline` prop (it will be undefined).
          // We check `inline` if it exists, otherwise fallback to heuristics:
          // 1. If there's a language tag, it's a block.
          // 2. If it spans multiple lines, it's a block.
          // 3. If it contains a newline, it's a block.
          const isInlineCode = typeof inline !== 'undefined' 
            ? inline 
            : match 
              ? false 
              : node?.position 
                ? node.position.start.line === node.position.end.line 
                : !String(children).includes('\n');

          // Inline Code Styling
          if (isInlineCode) {
            return (
              <code
                className='bg-surface-hover text-primary-text px-1 py-0.5 rounded text-sm font-mono'
                {...props}
              >
                {children}
              </code>
            );
          }

          // Fenced code block with language tag  ```js … ```
          if (language) {
            return (
              <div className='my-3 rounded-lg overflow-hidden border border-white/10'>
                {/* Language badge */}
                <div className='flex items-center justify-between bg-[#1e1e2e] px-4 py-1.5 border-b border-white/10'>
                  <span className='text-[11px] font-mono text-blue-300 uppercase tracking-widest'>
                    {language}
                  </span>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag='div'
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    background: '#13131a',
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          // Fenced block without language tag  ``` … ```
          return (
            <div className='my-3 rounded-lg overflow-hidden border border-white/10'>
              <SyntaxHighlighter
                style={oneDark}
                language='text'
                PreTag='div'
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  background: '#13131a',
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        },

        /* ── Paragraph ─────────────────────────────────────────── */
        p({ children }) {
          return (
            <p className='mb-3 last:mb-0 leading-relaxed text-[15px]'>
              {children}
            </p>
          );
        },

        /* ── Headings ──────────────────────────────────────────── */
        h1({ children }) {
          return <h1 className='text-2xl font-bold mt-4 mb-2'>{children}</h1>;
        },
        h2({ children }) {
          return <h2 className='text-xl font-bold mt-4 mb-2'>{children}</h2>;
        },
        h3({ children }) {
          return <h3 className='text-lg font-semibold mt-3 mb-1.5'>{children}</h3>;
        },

        /* ── Lists ─────────────────────────────────────────────── */
        ul({ children }) {
          return (
            <ul className='list-disc list-outside pl-5 mb-3 space-y-1 text-[15px]'>
              {children}
            </ul>
          );
        },
        ol({ children }) {
          return (
            <ol className='list-decimal list-outside pl-5 mb-3 space-y-1 text-[15px]'>
              {children}
            </ol>
          );
        },
        li({ children }) {
          return <li className='leading-relaxed'>{children}</li>;
        },

        /* ── Blockquote ────────────────────────────────────────── */
        blockquote({ children }) {
          return (
            <blockquote className='border-l-4 border-blue-500 pl-4 my-3 text-text-muted italic'>
              {children}
            </blockquote>
          );
        },

        /* ── Bold & Italic ─────────────────────────────────────── */
        strong({ children }) {
          return <strong className='font-semibold text-text-primary'>{children}</strong>;
        },
        em({ children }) {
          return <em className='italic text-text-muted'>{children}</em>;
        },

        /* ── Horizontal rule ───────────────────────────────────── */
        hr() {
          return <hr className='my-4 border-border dark:border-[#2D3042]' />;
        },

        /* ── Links ─────────────────────────────────────────────── */
        a({ href, children }) {
          return (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors'
            >
              {children}
            </a>
          );
        },

        /* ── Tables (GFM) ──────────────────────────────────────── */
        table({ children }) {
          return (
            <div className='overflow-x-auto my-3'>
              <table className='w-full border-collapse text-[14px]'>{children}</table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className='bg-white/5'>{children}</thead>;
        },
        th({ children }) {
          return (
            <th className='border border-white/10 px-3 py-2 text-left font-semibold'>
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className='border border-white/10 px-3 py-2'>{children}</td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
