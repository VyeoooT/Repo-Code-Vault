import { useHighlighter } from '../../hooks/useHighlighter';
import { copyTextToClipboard } from '../../lib/clipboard';
import { Skeleton } from '../common/Skeleton';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  copyText?: string;
}

export const CodeBlock = ({
  code,
  language,
  filename,
  copyText,
}: CodeBlockProps) => {
  const { highlight, loading } = useHighlighter();

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const html = highlight(code, language);
  const textToCopy = copyText ?? code;

  const handleCopy = async (): Promise<boolean> => {
    const result = await copyTextToClipboard(textToCopy);
    return result.ok;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
        <div className="flex gap-2">
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
            {language}
          </span>
          {filename && (
            <span className="text-xs text-slate-400">{filename}</span>
          )}
        </div>
        <CopyButton onCopy={handleCopy} />
      </div>
      <div
        className="overflow-x-auto p-4 font-mono text-sm text-slate-100"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
