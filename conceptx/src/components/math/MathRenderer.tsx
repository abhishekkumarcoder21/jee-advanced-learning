'use client';

import { useEffect, useRef, memo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  children: string;
  display?: boolean;
  className?: string;
}

export const Math = memo(function Math({ children, display = false, className = '' }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: false,
          strict: false,
          macros: {
            '\\R': '\\mathbb{R}',
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\C': '\\mathbb{C}',
          },
        });
      } catch {
        if (ref.current) {
          ref.current.textContent = children;
        }
      }
    }
  }, [children, display]);

  return <span ref={ref} className={className} />;
});

// Renders text with inline LaTeX ($...$) and display LaTeX ($$...$$)
export function MathText({ children, text, className = '' }: { children?: string; text?: string; className?: string }) {
  const content = text ?? children ?? '';
  const parts = parseLatex(content);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'display') {
          return <Math key={i} display>{part.content}</Math>;
        }
        if (part.type === 'inline') {
          return <Math key={i}>{part.content}</Math>;
        }
        return <span key={i} dangerouslySetInnerHTML={{ __html: sanitizeText(part.content) }} />;
      })}
    </span>
  );
}

interface LatexPart {
  type: 'text' | 'inline' | 'display';
  content: string;
}

function parseLatex(text: string): LatexPart[] {
  const parts: LatexPart[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Check for display math ($$...$$)
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
    // Check for inline math ($...$)
    const inlineMatch = remaining.match(/\$([^\$\n]+?)\$/);

    if (displayMatch && (!inlineMatch || (displayMatch.index ?? Infinity) <= (inlineMatch.index ?? Infinity))) {
      const idx = displayMatch.index ?? 0;
      if (idx > 0) {
        parts.push({ type: 'text', content: remaining.slice(0, idx) });
      }
      parts.push({ type: 'display', content: displayMatch[1] });
      remaining = remaining.slice(idx + displayMatch[0].length);
    } else if (inlineMatch) {
      const idx = inlineMatch.index ?? 0;
      if (idx > 0) {
        parts.push({ type: 'text', content: remaining.slice(0, idx) });
      }
      parts.push({ type: 'inline', content: inlineMatch[1] });
      remaining = remaining.slice(idx + inlineMatch[0].length);
    } else {
      parts.push({ type: 'text', content: remaining });
      break;
    }
  }

  return parts;
}

function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br/>');
}
