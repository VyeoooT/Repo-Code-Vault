import type { Snippet } from '../../types/snippet';
import { SnippetCard } from './SnippetCard';

interface SnippetListProps {
  snippets: Snippet[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
}

const Skeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl border border-slate-200 bg-white p-4 ${
        viewMode === 'grid' ? 'h-56' : 'h-40'
      }`}
    />
  );
};

export const SnippetList = ({
  snippets,
  isLoading,
  viewMode,
}: SnippetListProps) => {
  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
            : 'space-y-4'
        }
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No snippets found.
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
          : 'space-y-4'
      }
    >
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} viewMode={viewMode} />
      ))}
    </div>
  );
};
