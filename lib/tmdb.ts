import axios from 'axios';
import { 
  Movie, 
  TVShow,
  MediaItem,
  MovieListResponse,
  TVShowListResponse,
  MovieDetails, 
  TVShowDetails,
  Credit, 
  Video, 
  DiscoverParams, 
  MovieCreditsResponse, 
  MovieVideosResponse, 
  MovieReviewsResponse,
  MovieImagesResponse,
  Review,
  Image,
  Genre
} from '../types';

// Get API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error('TMDB API key is not set. Please set the NEXT_PUBLIC_TMDB_API_KEY environment variable.');
  console.error('You can get an API key from https://www.themoviedb.org/settings/api');
  console.error('Create a .env.local file in the root directory with: NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here');
}

const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  throw new Error('TMDB API key is not defined in environment variables. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env.local file. Get your API key from https://www.themoviedb.org/settings/api');
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

const fetchFromTMDB = async <T>(
  endpoint: string, 
  params: Record<string, string | number> = {},
  useCache: boolean = true
): Promise<T> => {
  // Create a cache key based on the endpoint and params
  const cacheKey = `${endpoint}?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {})
  ).toString()}`;

  // Return cached data if available and not expired
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T;
    }
  }

  const searchParams = new URLSearchParams();
  
  // Add API key to all requests
  searchParams.set('api_key', API_KEY);
  
  // Add language and other default params
  searchParams.set('language', 'en-US');
  searchParams.set('include_adult', 'false');
  
  // Add any additional params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}?${searchParams.toString()}`, {
      // Add timeout to prevent hanging requests
      timeout: 5000,
      // Add cache control headers
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
    
    // Cache the successful response
    if (useCache && response.data) {
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('TMDB API Error:', error.message);
      throw error;
    } else {
      console.error('TMDB API Error:', error);
      throw new Error('An unexpected error occurred while fetching from TMDB API');
    }
  }
};

export const getTrending = async (mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'day', page: number = 1) => {
  return fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`, { page });
};

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>(`/trending/movie/${timeWindow}`, { page });
};

export const getTrendingTVShows = async (timeWindow: 'day' | 'week' = 'week', page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>(`/trending/tv/${timeWindow}`, { page });
};

export const getPopularMovies = async (page: number = 1): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('/movie/popular', { page });
};

export const getTopRatedMovies = async (page: number = 1): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('/movie/top_rated', { page });
};

export const getUpcomingMovies = async (page: number = 1): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('/movie/upcoming', { page });
};

export const getMovieDetails = async (id: string | number): Promise<MovieDetails> => {
  return fetchFromTMDB<MovieDetails>(`/movie/${id}`, {
    append_to_response: 'videos,credits,reviews,images,similar,recommendations'
  });
};

export const getMovieCredits = async (id: string | number): Promise<MovieCreditsResponse> => {
  return fetchFromTMDB(`/movie/${id}/credits`);
};

export const getMovieVideos = async (id: string | number): Promise<Video[]> => {
  const data = await fetchFromTMDB<MovieVideosResponse>(`/movie/${id}/videos`);
  return data.results;
};

export const getMovieReviews = async (id: string | number): Promise<Review[]> => {
  const data = await fetchFromTMDB<MovieReviewsResponse>(`/movie/${id}/reviews`);
  return data.results;
};

export const getMovieImages = async (id: string | number): Promise<Image[]> => {
  const data = await fetchFromTMDB<MovieImagesResponse>(`/movie/${id}/images`);
  return data.backdrops.concat(data.posters);
};

export const getSimilarMovies = async (id: string | number, page: number = 1): Promise<Movie[]> => {
  const data = await fetchFromTMDB<MovieListResponse>(`/movie/${id}/similar`, { page });
  return data.results;
};

export const getMovieRecommendations = async (id: string | number): Promise<Movie[]> => {
  const data = await fetchFromTMDB<MovieListResponse>(`/movie/${id}/recommendations`);
  return data.results;
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieListResponse> => {
  return fetchFromTMDB<MovieListResponse>('/search/movie', { query, page });
};

export const searchMulti = async (query: string, page: number = 1) => {
  return fetchFromTMDB<{
    page: number;
    results: Array<Movie | TVShow>;
    total_pages: number;
    total_results: number;
  }>('/search/multi', { query, sort_by: 'popularity.desc' });
};

/**
 * Get the list of official genres for movies
 * @returns Promise with array of genre objects
 */
export const getMovieGenres = async (): Promise<{ genres: Genre[] }> => {
  return fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
};

/**
 * Get movies that belong to a specific genre
 * @param genreId - The genre ID to get movies for
 * @param page - Page number to return (default: 1)
 * @param queryString - Optional query string with additional parameters
 * @returns Promise with paginated movie results
 */
export const getMoviesByGenre = async (
  genreId: number,
  page: number = 1,
  queryString: string = ''
): Promise<MovieListResponse> => {
  const params: Record<string, string | number> = {
    with_genres: genreId,
    page,
  };

  // Parse query string and add to params
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  // Ensure sort_by is set, default to popularity.desc
  if (!params.sort_by) {
    params.sort_by = 'popularity.desc';
  }

  return fetchFromTMDB<MovieListResponse>('/discover/movie', params);
};

// Alias for backward compatibility
export const getGenres = getMovieGenres;

// All functions are already exported individually above

export const getPopularTVShows = async (page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>('/tv/popular', { page });
};

export const getTopRatedTVShows = async (page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>('/tv/top_rated', { page });
};

export const getAiringTodayTVShows = async (page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>('/tv/airing_today', { page });
};

export const getOnTheAirTVShows = async (page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>('/tv/on_the_air', { page });
};

export const getTVShowDetails = async (id: string | number): Promise<TVShowDetails> => {
  return fetchFromTMDB<TVShowDetails>(`/tv/${id}`, {
    append_to_response: 'videos,credits,reviews,images,similar,recommendations,content_ratings,external_ids'
  });
};

export const getTVShowVideos = async (id: string | number): Promise<Video[]> => {
  const data = await fetchFromTMDB<MovieVideosResponse>(`/tv/${id}/videos`);
  return data.results;
};

export const searchTVShows = async (query: string, page: number = 1): Promise<TVShowListResponse> => {
  if (!query.trim()) {
    return getPopularTVShows(page);
  }
  return fetchFromTMDB<TVShowListResponse>('/search/tv', { query, page });
};

export const getTVShowGenres = async (): Promise<{ genres: Genre[] }> => {
  return fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
};

export const getTVShowsByGenre = async (
  genreId: number,
  page: number = 1,
  queryString: string = ''
): Promise<TVShowListResponse> => {
  const params: Record<string, string | number> = {
    with_genres: genreId,
    page,
  };

  // Parse query string and add to params
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      // Convert first_air_date_year to first_air_date_year for TV shows
      if (key === 'year') {
        params['first_air_date_year'] = value;
      } else {
        params[key] = value;
      }
    });
  }

  // Ensure sort_by is set, default to popularity.desc
  if (!params.sort_by) {
    params.sort_by = 'popularity.desc';
  }

  return fetchFromTMDB<TVShowListResponse>('/discover/tv', params);
};

export const getSimilarTVShows = async (tvId: string | number, page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>(`/tv/${tvId}/similar`, { page });
};

export const getTVShowRecommendations = async (tvId: string | number, page: number = 1): Promise<TVShowListResponse> => {
  return fetchFromTMDB<TVShowListResponse>(`/tv/${tvId}/recommendations`, { page });
};

export const getTVShowCredits = async (id: string | number): Promise<MovieCreditsResponse> => {
  return fetchFromTMDB<MovieCreditsResponse>(`/tv/${id}/credits`);
};

export const getTVShowReviews = async (id: string | number): Promise<{ results: Review[] }> => {
  return fetchFromTMDB<{ results: Review[] }>(`/tv/${id}/reviews`);
};

export const getLatestMovies = async (page: number = 1): Promise<MovieListResponse> => {
  // Get current date and date from 3 months ago
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  const params = {
    'primary_release_date.gte': threeMonthsAgo.toISOString().split('T')[0],
    'primary_release_date.lte': now.toISOString().split('T')[0],
    sort_by: 'primary_release_date.desc',
    'vote_count.gte': '100',
    'vote_average.gte': '6',
    page: String(page)
  };
  
  return fetchFromTMDB<MovieListResponse>('/discover/movie', params);
};

export async function getTVShowImages(tvId: string): Promise<MovieImagesResponse> {
  return fetchFromTMDB<MovieImagesResponse>(`/tv/${tvId}/images`);
}

export interface TVSeasonDetails {
  _id: string;
  air_date: string;
  episodes: Array<{
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    crew: Array<{
      job: string;
      department: string;
      credit_id: string;
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string | null;
    }>;
    guest_stars: Array<{
      character: string;
      credit_id: string;
      order: number;
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string | null;
    }>;
  }>;
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export async function getTVSeasonDetails(tvId: string, seasonNumber: string | number): Promise<TVSeasonDetails> {
  return fetchFromTMDB<TVSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, {
    append_to_response: 'credits,images,videos'
  });
};
