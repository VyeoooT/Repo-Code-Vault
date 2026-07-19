import { useEffect, useState } from 'react';

import { getSnippets } from '../services/snippets';
import type { PaginatedMeta } from '../types/api';
import type { Snippet } from '../types/snippet';

const defaultMeta: PaginatedMeta = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(defaultMeta);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getSnippets({
          page,
          limit: 12,
          search: search.trim() || undefined,
          categoryId,
        });

        setSnippets(response.data);
        setMeta(response.meta);
      } catch {
        setError('Failed to load snippets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchSnippets();
  }, [categoryId, page, search]);

  const updateSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const updateCategoryId = (value?: string) => {
    setPage(1);
    setCategoryId(value);
  };

  return {
    snippets,
    meta,
    page,
    search,
    categoryId,
    isLoading,
    error,
    setPage,
    setSearch: updateSearch,
    setCategoryId: updateCategoryId,
  };
};
