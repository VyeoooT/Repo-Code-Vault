import { useEffect, useState } from 'react';

import { getTags } from '../services/tags';
import type { Tag } from '../types/tag';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTags();
        setTags(data);
      } catch {
        setError('Failed to load tags.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTags();
  }, []);

  return { tags, isLoading, error };
};
