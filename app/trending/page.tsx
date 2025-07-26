import React from 'react';
import MovieGrid from '../../components/MovieGrid';
import { getTrendingMovies } from '../../lib/tmdb';

export default async function TrendingPage() {
  const trendingResponse = await getTrendingMovies('week');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trending Now</h1>
      <MovieGrid movies={trendingResponse.results} />
    </div>
  );
}
