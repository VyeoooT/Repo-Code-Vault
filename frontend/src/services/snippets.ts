import type { PaginatedResponse } from '../types/api';
import type { Snippet, SnippetQueryParams } from '../types/snippet';
import { apiClient } from './api';

export const getSnippets = async (
  params: SnippetQueryParams
): Promise<PaginatedResponse<Snippet>> => {
  const response = await apiClient.get<PaginatedResponse<Snippet>>(
    '/snippets',
    {
      params,
    }
  );
  return response.data;
};

export const getSnippetById = async (id: string): Promise<Snippet> => {
  const response = await apiClient.get<Snippet>(`/snippets/${id}`);
  return response.data;
};
