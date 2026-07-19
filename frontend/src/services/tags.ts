import type { Tag } from '../types/tag';
import { apiClient } from './api';

export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get<Tag[]>('/tags');
  return response.data;
};
