import { useEffect, useRef, useState } from 'react';
import type { Highlighter } from 'shiki';
import { getSingletonHighlighter } from 'shiki';

type HighlightFn = (code: string, language: string) => string;

interface UseHighlighterReturn {
  highlight: HighlightFn;
  loading: boolean;
  error: Error | null;
}

export const useHighlighter = (): UseHighlighterReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const highlighterRef = useRef<Highlighter | null>(null);

  useEffect(() => {
    getSingletonHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'html',
        'css',
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'php',
        'python',
        'json',
        'bash',
        'plaintext',
      ],
    })
      .then((hl) => {
        highlighterRef.current = hl;
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const highlight: HighlightFn = (code: string, language: string) => {
    if (!highlighterRef.current) {
      return `<pre><code>${code}</code></pre>`;
    }

    try {
      const validLang = highlighterRef.current
        .getLoadedLanguages()
        .includes(language)
        ? language
        : 'plaintext';
      return highlighterRef.current.codeToHtml(code, {
        lang: validLang,
        theme: 'github-dark',
      });
    } catch {
      return `<pre><code>${code}</code></pre>`;
    }
  };

  return { highlight, loading, error };
};
