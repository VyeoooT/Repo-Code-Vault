import type { Category } from '../types/category';
import { apiClient } from './api';

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};
