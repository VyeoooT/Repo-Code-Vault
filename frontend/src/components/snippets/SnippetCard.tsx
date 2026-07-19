import { Link } from 'react-router-dom';

import type { Snippet } from '../../types/snippet';

interface SnippetCardProps {
  snippet: Snippet;
  viewMode: 'grid' | 'list';
}

const toRelativeDate = (dateText: string) => {
  const date = new Date(dateText).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${diffHours || 1}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const createExcerpt = (text?: string | null) => {
  if (!text) {
    return 'No description yet.';
  }

  const words = text.split(' ');
  if (words.length <= 30) {
    return text;
  }

  return `${words.slice(0, 30).join(' ')}...`;
};

export const SnippetCard = ({ snippet, viewMode }: SnippetCardProps) => {
  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
        viewMode === 'list'
          ? 'flex flex-col gap-2 sm:flex-row sm:items-start'
          : ''
      }`}
    >
      {snippet.thumbnail ? (
        <img
          src={snippet.thumbnail}
          alt={snippet.title}
          className={`rounded-lg object-cover ${
            viewMode === 'list' ? 'h-28 w-full sm:w-40' : 'mb-3 h-36 w-full'
          }`}
        />
      ) : null}

      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
            {snippet.category.name}
          </span>
          <span className="text-xs text-slate-500">
            Updated {toRelativeDate(snippet.updatedAt)}
          </span>
        </div>

        <h3 className="text-base font-semibold text-slate-900">
          {snippet.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {createExcerpt(snippet.description)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {snippet.tags.map((item) => (
            <span
              key={`${item.snippetId}-${item.tagId}`}
              className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700"
            >
              #{item.tag.name}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <Link
            to={`/snippets/${snippet.id}`}
            className="text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            View detail
          </Link>
        </div>
      </div>
    </article>
  );
};
