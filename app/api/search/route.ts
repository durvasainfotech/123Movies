import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> => {
  const searchParams = new URLSearchParams();
  
  // Add API key to all requests
  searchParams.set('api_key', API_KEY || '');
  
  // Add language and other default params
  searchParams.set('language', 'en-US');
  searchParams.set('include_adult', 'false');
  
  // Add any additional params
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });
  
  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`;
  
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
};

interface MovieResult {
  id: number;
  title: string;
  name?: string;
  media_type: string;
  poster_path: string | null;
  popularity: number;
}

interface TVShowResult {
  id: number;
  name: string;
  title?: string;
  media_type: string;
  poster_path: string | null;
  popularity: number;
}

interface SearchResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    // Search for both movies and TV shows
    const [moviesResponse, tvResponse] = await Promise.all([
      fetchFromTMDB<SearchResponse<MovieResult>>('/search/movie', { query }),
      fetchFromTMDB<SearchResponse<TVShowResult>>('/search/tv', { query })
    ]);

    // Combine and format results
    const results = [
      ...(moviesResponse.results || []).map((item: any) => ({
        ...item,
        media_type: 'movie',
        title: item.title || item.name
      })),
      ...(tvResponse.results || []).map((item: any) => ({
        ...item,
        media_type: 'tv',
        title: item.name || item.title
      }))
    ]
    // Sort by popularity (if available) or vote average
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    // Filter out items without a title or name
    .filter(item => item.title);

    return NextResponse.json({
      results: results.slice(0, 10) // Limit to 10 results
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}
