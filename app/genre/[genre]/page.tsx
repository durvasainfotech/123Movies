'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  getMoviesByGenre, 
  getTVShowsByGenre, 
  getMovieGenres,
  getTVShowGenres 
} from '../../../lib/tmdb';
import MovieGrid from '../../../components/MovieGrid';
import { Genre, Movie, TVShow } from '../../../types';

// Sort options for the dropdown
const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'revenue.desc', label: 'Highest Grossing' },
  { value: 'vote_count.desc', label: 'Most Voted' },
] as const;

// Year range for the year filter (last 30 years)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

interface GenrePageProps {
  params: {
    genre: string;
  };
}

// Genre interface with type information
interface GenreInfo {
  id: number;
  name: string;
  type: 'movie' | 'tv';
}

export default function GenrePage({ params }: GenrePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { genre } = params;
  
  // State for pagination and filters
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [sortBy, setSortBy] = useState<string>('popularity.desc');
  const [year, setYear] = useState<number | undefined>(
    searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined
  );
  const [voteAverageGte, setVoteAverageGte] = useState<number | undefined>(
    searchParams.get('vote_average.gte') ? parseFloat(searchParams.get('vote_average.gte')!) : undefined
  );
  const [language, setLanguage] = useState<string | undefined>(
    searchParams.get('language') || undefined
  );
  
  // State for data
  const [data, setData] = useState<{
    results: (Movie | TVShow)[];
    page: number;
    total_pages: number;
    total_results: number;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allGenres, setAllGenres] = useState<{
    movie: Genre[];
    tv: Genre[];
  }>({ movie: [], tv: [] });

  // Get genre info from URL
  const genreInfo = useMemo<GenreInfo | undefined>(() => {
    if (!allGenres.movie.length && !allGenres.tv.length) return undefined;
    
    // Try to find by slug first
    const foundBySlug = [...allGenres.movie, ...allGenres.tv].find(g => 
      g.name.toLowerCase().replace(/\s+/g, '-') === genre.toLowerCase()
    );
    
    if (foundBySlug) {
      return {
        id: foundBySlug.id,
        name: foundBySlug.name,
        type: allGenres.movie.some(g => g.id === foundBySlug.id) ? 'movie' : 'tv'
      };
    }
    
    // Try to find by ID if the slug is a number
    const genreId = parseInt(genre, 10);
    if (!isNaN(genreId)) {
      const foundById = [...allGenres.movie, ...allGenres.tv].find(g => g.id === genreId);
      if (foundById) {
        return {
          id: foundById.id,
          name: foundById.name,
          type: allGenres.movie.some(g => g.id === foundById.id) ? 'movie' : 'tv'
        };
      }
    }
    
    return undefined;
  }, [genre, allGenres]);
  
  // Fetch all genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          getMovieGenres(),
          getTVShowGenres()
        ]);
        
        setAllGenres({
          movie: movieGenres.genres,
          tv: tvGenres.genres
        });
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres. Please try again later.');
      }
    };
    
    fetchGenres();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!genreInfo) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.set('sort_by', sortBy);
        if (year) queryParams.set('year', year.toString());
        if (voteAverageGte) queryParams.set('vote_average.gte', voteAverageGte.toString());
        if (language) queryParams.set('language', language);
        
        const response = await (genreInfo.type === 'movie'
          ? getMoviesByGenre(genreInfo.id, page, queryParams.toString())
          : getTVShowsByGenre(genreInfo.id, page, queryParams.toString()));
        
        setData({
          results: response.results,
          page: response.page,
          total_pages: Math.min(response.total_pages, 500), // TMDB API limit
          total_results: response.total_results,
        });
        
        // Update URL with current filters
        const urlParams = new URLSearchParams();
        urlParams.set('page', page.toString());
        if (mediaType !== 'movie') urlParams.set('type', mediaType);
        if (sortBy !== 'popularity.desc') urlParams.set('sort_by', sortBy);
        if (year) urlParams.set('year', year.toString());
        if (voteAverageGte) urlParams.set('vote_average.gte', voteAverageGte.toString());
        if (language) urlParams.set('language', language);
        
        // Only update URL if something changed to prevent unnecessary navigation
        const newSearch = urlParams.toString();
        const currentSearch = searchParams.toString();
        
        if (newSearch !== currentSearch) {
          router.replace(`/genre/${genre}?${newSearch}`, { scroll: false });
        }
        
      } catch (err) {
        console.error('Error fetching genre data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genre, page, mediaType, sortBy, year, voteAverageGte, language, genreInfo, searchParams, router]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format genre name for display
  const formatGenreName = (genreSlug: string) => {
    if (genreInfo) return genreInfo.name;
    
    // Fallback to formatting the URL slug
    return genreSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle loading more movies
  const handleLoadMore = async () => {
    if (!genreInfo) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('sort_by', sortBy);
      if (year) queryParams.set('year', year.toString());
      if (voteAverageGte) queryParams.set('vote_average.gte', voteAverageGte.toString());
      if (language) queryParams.set('language', language);
      
      const response = genreInfo.type === 'movie'
        ? await getMoviesByGenre(genreInfo.id, nextPage, queryParams.toString())
        : await getTVShowsByGenre(genreInfo.id, nextPage, queryParams.toString());
      
      setData(prev => ({
        ...response,
        results: [...(prev?.results || []), ...response.results],
      }));
      setPage(nextPage);
    } catch (err) {
      setError('Failed to load more content');
      console.error('Error loading more content:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!allGenres.movie.length && !allGenres.tv.length) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!genreInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Genre Not Found</h1>
        <p className="text-gray-400 mb-6">The requested genre "{genre}" could not be found.</p>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-800 rounded w-1/3 mb-8"></div>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="h-10 bg-gray-800 rounded w-48"></div>
            <div className="h-10 bg-gray-800 rounded w-48"></div>
            <div className="h-10 bg-gray-800 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-400">{error || 'Failed to load content'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {formatGenreName(genre)} {genreInfo.type === 'tv' ? 'TV Shows' : 'Movies'}
          </h1>
          {data && (
            <p className="text-gray-400 mt-1">
              {data.total_results.toLocaleString()} {data.total_results === 1 ? 'title' : 'titles'} found
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1); // Reset to first page when changing sort
            }}
            className="bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={year || ''}
            onChange={(e) => {
              setYear(e.target.value ? parseInt(e.target.value) : undefined);
              setPage(1);
            }}
            className="bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Years</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          <select
            value={voteAverageGte || ''}
            onChange={(e) => {
              setVoteAverageGte(e.target.value ? parseFloat(e.target.value) : undefined);
              setPage(1);
            }}
            className="bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Ratings</option>
            {[7, 8, 9].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ Rating
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg mb-8">
          <h3 className="font-bold">Error Loading Content</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      ) : data && data.results.length > 0 ? (
        <div className="mb-8">
          <MovieGrid 
            movies={data.results} 
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={handlePageChange}
            type={genreInfo.type}
          />
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-900/50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-300">No {formatGenreName(genre)} {genreInfo.type === 'tv' ? 'TV shows' : 'movies'} found</h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or check back later for updates
          </p>
          <button
            onClick={() => {
              setSortBy('popularity.desc');
              setYear(undefined);
              setVoteAverageGte(undefined);
              setPage(1);
            }}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && data && (
        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-xs text-gray-400 overflow-x-auto">
          <pre>{JSON.stringify({
            genre,
            genreInfo,
            page,
            totalPages: data?.total_pages,
            totalResults: data?.total_results,
            filters: { sortBy, year, voteAverageGte, language }
          }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
