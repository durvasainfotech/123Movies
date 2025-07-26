'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FilmIcon, TvIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface StreamingOption {
  type: 'subscription' | 'rent' | 'buy' | 'addon';
  link: string;
  videoLink: string;
  quality: string;
  audios: Array<{
    language: string;
    region: string;
  }>;
  subtitles: Array<{
    locale: {
      language: string;
      region?: string;
    };
    closedCaptions: boolean;
  }>;
  expiresSoon: boolean;
  availableSince: number;
  price?: {
    amount: string;
    currency: string;
    formatted: string;
  };
  expiresOn?: number;
  addon?: {
    id: string;
    displayName: string;
    homePage: string;
    themeColorCode: string;
    image: string;
  };
}

interface Show {
  itemType: 'show';
  showType: 'movie' | 'series';
  id: string;
  imdbId: string;
  tmdbId: string;
  title: string;
  overview: string;
  releaseYear: number;
  originalTitle: string;
  genres: string[];
  directors: string[];
  cast: string[];
  rating: number;
  runtime: number;
  poster?: string;
  type?: 'movie' | 'series';
  year?: number;
  imdbRating?: number;
  imageSet: {
    verticalPoster: string;
    horizontalPoster: string;
    backdrop: string;
    verticalBackdrop: string;
  };
  streamingInfo?: {
    [country: string]: {
      [service: string]: any;
    };
  };
  streamingOptions: {
    [country: string]: {
      [service: string]: StreamingOption;
    };
  };
}

export default function NetflixPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchShows = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://streaming-availability.p.rapidapi.com/v2/search/title?title=${encodeURIComponent(query)}&country=us&show_type=all&output_language=en`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
            'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch shows');
      }
      
      const data = await response.json();
      
      if (!data.result || data.result.length === 0) {
        throw new Error('No results found');
      }
      
      // Filter for Netflix US and transform the data
      const formattedShows = data.result
        .filter((item: any) => item.streamingOptions?.us?.netflix)
        .map((item: any) => {
          const showType = item.showType || item.type;
          const releaseYear = item.releaseYear || item.year;
          const rating = item.rating || item.imdbRating;
          const streamingOptions = item.streamingOptions || item.streamingInfo || {};
          
          return {
            ...item,
            id: item.imdbId || item.id,
            title: item.title,
            type: showType,
            year: releaseYear,
            poster: item.imageSet?.verticalPoster || item.imageSet?.horizontalPoster || '/placeholder-poster.jpg',
            overview: item.overview || 'No description available.',
            imdbRating: rating,
            streamingInfo: streamingOptions,
            streamingOptions: streamingOptions
          };
        });
      
      setShows(formattedShows);
    } catch (err) {
      console.error('Error fetching shows:', err);
      setError('Failed to fetch shows. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchShows(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Netflix Content Search</h1>
          <p className="text-gray-600">Find what's available on Netflix</p>
        </div>
        
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Search for movies and TV shows..."
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2.5 bottom-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {!isLoading && shows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shows.map((show) => (
              <div key={show.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <Image
                    src={show.poster || '/placeholder-poster.jpg'}
                    alt={show.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {show.type === 'movie' ? 'MOVIE' : 'SERIES'}
                  </div>
                  {(show.streamingOptions?.us?.netflix?.expiresSoon || show.streamingInfo?.us?.netflix?.expiresSoon) && (
                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      LEAVING SOON
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{show.title}</h3>
                    {show.imdbRating && (
                      <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        <StarIcon className="h-3 w-3 mr-1" />
                        {show.imdbRating}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span>{show.year || show.releaseYear}</span>
                    {show.streamingOptions?.us?.netflix?.expiresSoon && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Leaving soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{show.overview || 'No description available.'}</p>
                  <a
                    href={show.streamingOptions?.us?.netflix?.link || show.streamingInfo?.us?.netflix?.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    onClick={(e) => {
                      const netflixLink = show.streamingOptions?.us?.netflix?.link || show.streamingInfo?.us?.netflix?.link;
                      if (!netflixLink) {
                        e.preventDefault();
                        alert('This show is not currently available on Netflix');
                      }
                    }}
                  >
                    {(show.streamingOptions?.us?.netflix || show.streamingInfo?.us?.netflix) ? 'Watch on Netflix' : 'Not on Netflix'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && shows.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <FilmIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shows found</h3>
            <p className="mt-1 text-sm text-gray-500">Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
