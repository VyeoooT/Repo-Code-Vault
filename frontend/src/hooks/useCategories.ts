import { useEffect, useState } from 'react';

import { getCategories } from '../services/categories';
import type { Category } from '../types/category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError('Failed to load categories.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
