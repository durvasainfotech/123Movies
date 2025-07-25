'use client';

import { Suspense } from 'react';
import { useMovies } from '@/hooks/useTMDB';
import BannerAd from '@/components/BannerAd';
import { DynamicHero, DynamicMovieSlider, DynamicMovieGrid } from '@/components/DynamicImports';
import type { MovieListResponse } from '@/types/tmdb';

// Type for the movie data we expect
interface MovieData {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

type MovieListData = MovieData | null;

// Define the props for the Home component
interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
  params?: { [key: string]: string };
}

// Define the type for our initial data
interface InitialData {
  trending?: MovieListData;
  popular?: MovieListData;
  topRated?: MovieListData;
  upcoming?: MovieListData;
}

// Define the page component with proper Next.js page props
export default function Home({ searchParams = {}, params = {} }: PageProps) {
  // Get initial data from URL params if available
  const initialData = searchParams.initialData 
    ? (JSON.parse(decodeURIComponent(searchParams.initialData as string)) as InitialData) 
    : undefined;
  // Use initial data if available, otherwise fetch on the client
  const { trending, popular, topRated, upcoming, loading } = useMovies({
    initialData: initialData ? {
      trending: initialData.trending || null,
      popular: initialData.popular || null,
      topRated: initialData.topRated || null,
      upcoming: initialData.upcoming || null
    } : undefined
  }) as {
    trending: MovieListData;
    popular: MovieListData;
    topRated: MovieListData;
    upcoming: MovieListData;
    loading: boolean;
    error: Error | null;
  };

  // Show loading state if data is being fetched and no initial data is available
  if (loading && !initialData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading movies...</div>
      </div>
    );
  }

  // Helper function to safely check if a movie list has results
  const hasResults = (data: MovieListData): data is MovieData => {
    return data !== null && 
           'results' in data && 
           Array.isArray(data.results) && 
           data.results.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          {hasResults(trending) && (
            <section className="mb-12">
              <DynamicHero movies={trending.results} />
            </section>
          )}

          {/* Popular Movies */}
          {hasResults(popular) && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
              <DynamicMovieSlider movies={popular.results} />
            </section>
          )}

          {/* Banner Ad */}
          <div className="my-8">
            <BannerAd id="banner-ad-1" />
          </div>

          {/* Top Rated Movies */}
          {hasResults(topRated) && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Top Rated Movies</h2>
              <DynamicMovieSlider movies={topRated.results} />
            </section>
          )}

          {/* Upcoming Movies */}
          {hasResults(upcoming) && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Upcoming Movies</h2>
              <DynamicMovieGrid movies={upcoming.results} />
            </section>
          )}

          {/* Fallback when no data is available */}
          {!loading && !hasResults(trending) && !hasResults(popular) && 
           !hasResults(topRated) && !hasResults(upcoming) && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No movies found</h2>
              <p>Please check your internet connection or try again later.</p>
            </div>
          )}
        </main>
      </Suspense>
    </div>
  );
}
