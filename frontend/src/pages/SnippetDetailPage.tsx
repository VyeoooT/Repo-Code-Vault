import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Layout } from '../components/layout/Layout';
import { CodeBlock } from '../components/snippets/CodeBlock';
import { CopyButton } from '../components/snippets/CopyButton';
import { LivePreview } from '../components/snippets/LivePreview';
import { PreviewToggle } from '../components/snippets/PreviewToggle';
import { useAuth } from '../hooks/useAuth';
import { copyTextToClipboard } from '../lib/clipboard';
import { getSnippetById } from '../services/snippets';
import type { Snippet, SnippetFile } from '../types/snippet';

const toRelativeDate = (dateText: string) => {
  const date = new Date(dateText).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${diffHours || 1}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
};

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    html: 'html',
    css: 'css',
    javascript: 'js',
    typescript: 'ts',
    tsx: 'tsx',
    jsx: 'jsx',
    php: 'php',
    python: 'py',
    json: 'json',
    bash: 'sh',
    plaintext: 'txt',
  };
  return extensions[language] || language;
}

function hasHTMLFile(files: SnippetFile[]): boolean {
  return files.some((f) => f.language === 'html');
}

function formatAllFilesForCopy(files: SnippetFile[]): string {
  return files
    .map((file, index) => {
      const ext = getFileExtension(file.language);
      return `// File ${index + 1}: file.${ext} (${file.language})\n${file.content}`;
    })
    .join('\n\n');
}

type TabType = 'code' | 'preview';

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [activeFileTab, setActiveFileTab] = useState(0);
  const [activeMainTab, setActiveMainTab] = useState<TabType>('code');
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>(
    'desktop'
  );
  const [loading, setLoading] = useState(!id);
  const [error, setError] = useState<string | null>(
    id ? null : 'Snippet ID is missing'
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    getSnippetById(id)
      .then((data) => {
        setSnippet(data);
        setError(null);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load snippet');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user?.uid === snippet?.authorId;
  const hasPreview = snippet && hasHTMLFile(snippet.files);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="mt-8 h-64 rounded bg-slate-200" />
        </div>
      </Layout>
    );
  }

  if (error || !snippet) {
    return (
      <Layout>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            {error || 'Snippet not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-red-700 underline hover:text-red-900"
          >
            Back to snippets
          </button>
        </div>
      </Layout>
    );
  }

  const currentFile =
    snippet.files.length > 0 ? snippet.files[activeFileTab] : null;
  const copyAllCode = async (): Promise<boolean> => {
    const result = await copyTextToClipboard(
      formatAllFilesForCopy(snippet.files)
    );
    return result.ok;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-blue-700 hover:text-blue-900 hover:underline"
        >
          ← Back to snippets
        </button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {snippet.title}
              </h1>
              {snippet.description && (
                <p className="mt-2 text-slate-600">{snippet.description}</p>
              )}
            </div>
            {isOwner && (
              <button
                onClick={() => navigate(`/snippets/${snippet.id}/edit`)}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Edit
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <div>
              <span className="font-medium">By:</span>{' '}
              {snippet.author.name || snippet.author.email}
            </div>
            <div>
              <span className="font-medium">Category:</span>{' '}
              {snippet.category.name}
            </div>
            <div>
              <span className="font-medium">Created:</span>{' '}
              {toRelativeDate(snippet.createdAt)}
            </div>
            {snippet.updatedAt !== snippet.createdAt && (
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {toRelativeDate(snippet.updatedAt)}
              </div>
            )}
          </div>

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((item) => (
                <span
                  key={`${item.snippetId}-${item.tagId}`}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  #{item.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code section */}
        {snippet.files.length > 0 ? (
          <div className="space-y-4">
            {/* Main tabs: Code / Preview */}
            <div className="flex items-center justify-between border-b border-slate-200">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMainTab('code')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeMainTab === 'code'
                      ? 'border-b-2 border-blue-700 text-blue-700'
                      : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Code
                </button>
                {hasPreview && (
                  <button
                    onClick={() => setActiveMainTab('preview')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeMainTab === 'preview'
                        ? 'border-b-2 border-blue-700 text-blue-700'
                        : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Preview
                  </button>
                )}
              </div>
              <CopyButton label="Copy all code" onCopy={copyAllCode} />
            </div>

            {/* Code Tab */}
            {activeMainTab === 'code' && (
              <div className="space-y-4">
                {/* File tabs */}
                {snippet.files.length > 1 && (
                  <div className="flex gap-2 border-b border-slate-200">
                    {snippet.files.map((file: SnippetFile, idx: number) => (
                      <button
                        key={file.id}
                        onClick={() => setActiveFileTab(idx)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeFileTab === idx
                            ? 'border-b-2 border-blue-700 text-blue-700'
                            : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {file.language}
                      </button>
                    ))}
                  </div>
                )}

                {/* Code block */}
                {currentFile && (
                  <CodeBlock
                    code={currentFile.content}
                    language={currentFile.language}
                    filename={`file.${getFileExtension(currentFile.language)}`}
                  />
                )}
              </div>
            )}

            {/* Preview Tab */}
            {activeMainTab === 'preview' && hasPreview && (
              <div className="space-y-4">
                <PreviewToggle
                  viewportMode={viewportMode}
                  onToggle={setViewportMode}
                />
                <LivePreview
                  files={snippet.files}
                  viewportMode={viewportMode}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-slate-50 p-6 text-center text-slate-600">
            No code files attached to this snippet.
          </div>
        )}
      </div>
    </Layout>
  );
}
