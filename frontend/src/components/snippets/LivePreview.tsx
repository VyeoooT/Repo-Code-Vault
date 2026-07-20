import { useEffect, useRef, useState } from 'react';

import type { SnippetFile } from '../../types/snippet';

interface LivePreviewProps {
  files: SnippetFile[];
  viewportMode: 'mobile' | 'desktop';
}

const generateHTML = (files: SnippetFile[]): string => {
  const html = files.find((f) => f.language === 'html')?.content || '';
  const css = files.find((f) => f.language === 'css')?.content || '';
  const js = files.find((f) => f.language === 'javascript')?.content || '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
  `;
};

export const LivePreview = ({ files, viewportMode }: LivePreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    let errorMsg: string | null = null;
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generateHTML(files));
        doc.close();
      }
    } catch (err) {
      errorMsg =
        err instanceof Error ? err.message : 'Failed to render preview';
    }
    setRenderError(errorMsg);
  }, [files]);

  const iframeWidth = viewportMode === 'mobile' ? '375px' : '100%';

  if (renderError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="text-sm font-semibold text-red-900">Preview Error</h3>
        <p className="mt-2 text-sm text-red-700">{renderError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <iframe
          ref={iframeRef}
          title="Live Preview"
          sandbox="allow-same-origin allow-scripts"
          className="w-full border-0"
          style={{
            width: iframeWidth,
            minHeight: '500px',
            maxWidth: '100%',
            margin: '0 auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};
