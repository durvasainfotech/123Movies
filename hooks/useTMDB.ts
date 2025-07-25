import { useState, useEffect } from 'react';
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getTrendingMovies
} from '@/lib/tmdb';
import type { MovieListResponse } from '@/types/tmdb';

interface UseMoviesOptions {
  initialData?: {
    popular?: MovieListResponse | null;
    topRated?: MovieListResponse | null;
    upcoming?: MovieListResponse | null;
    trending?: MovieListResponse | null;
  };
}

export const useMovies = ({ initialData }: UseMoviesOptions = {}) => {
  const [data, setData] = useState<{
    popular: MovieListResponse | null;
    topRated: MovieListResponse | null;
    upcoming: MovieListResponse | null;
    trending: MovieListResponse | null;
  }>({
    popular: initialData?.popular || null,
    topRated: initialData?.topRated || null,
    upcoming: initialData?.upcoming || null,
    trending: initialData?.trending || null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Only fetch what's not already in the initial props
        const [popular, topRated, upcoming, trending] = await Promise.all([
          !data.popular ? getPopularMovies(1) : Promise.resolve(null),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
          getTrendingMovies('week', 1)
        ]);

        setData(prev => ({
          popular: popular || prev.popular,
          topRated: topRated || prev.topRated,
          upcoming: upcoming || prev.upcoming,
          trending: trending || prev.trending
        }));
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch movies'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...data, loading, error };
};
