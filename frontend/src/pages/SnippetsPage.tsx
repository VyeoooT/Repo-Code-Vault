import { useMemo, useState } from 'react';

import { Pagination } from '../components/common/Pagination';
import { Layout } from '../components/layout/Layout';
import { SnippetList } from '../components/snippets/SnippetList';
import { useCategories } from '../hooks/useCategories';
import { useSnippets } from '../hooks/useSnippets';
import { useTags } from '../hooks/useTags';

export default function SnippetsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { tags } = useTags();
  const {
    snippets,
    meta,
    page,
    search,
    categoryId,
    isLoading,
    error,
    setPage,
    setSearch,
    setCategoryId,
  } = useSnippets();

  const totalTagCount = useMemo(() => tags.length, [tags.length]);

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Categories
          </h2>
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm ${
              !categoryId ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
            }`}
          >
            All categories
          </button>

          {categoriesLoading ? (
            <p className="text-sm text-slate-500">Loading categories...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                    categoryId === category.id
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-slate-500">
            Available tags: {totalTagCount}
          </p>
        </aside>

        <section>
          <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search snippets by title..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 sm:max-w-md"
              />

              <div className="inline-flex rounded-md border border-slate-300 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded px-3 py-1 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded px-3 py-1 text-sm ${
                    viewMode === 'list'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <SnippetList
            snippets={snippets}
            isLoading={isLoading}
            viewMode={viewMode}
          />
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </Layout>
  );
}
