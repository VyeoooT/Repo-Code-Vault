import type { PaginatedResponse } from '../types/api';
import type {
  Snippet,
  SnippetQueryParams,
  UpsertSnippetPayload,
} from '../types/snippet';
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

export const createSnippet = async (
  payload: UpsertSnippetPayload
): Promise<Snippet> => {
  const response = await apiClient.post<Snippet>('/snippets', payload);
  return response.data;
};

export const updateSnippet = async (
  id: string,
  payload: UpsertSnippetPayload
): Promise<Snippet> => {
  const response = await apiClient.put<Snippet>(`/snippets/${id}`, payload);
  return response.data;
};
