import React from 'react';
import { 
  getPopularMovies, 
  getTrendingMovies,
  getTopRatedMovies,
  getUpcomingMovies
} from '../lib/tmdb';
import Home from './page';

// This function runs on the server at build time
export default async function HomePage() {
  try {
    // Get all the data we need in parallel
    const [popular, trending, topRated, upcoming] = await Promise.all([
      getPopularMovies(1),
      getTrendingMovies('week', 1),
      getTopRatedMovies(1),
      getUpcomingMovies(1)
    ]);
    
    return (
      <Home 
        initialData={{
          trending: JSON.parse(JSON.stringify(trending)),
          popular: JSON.parse(JSON.stringify(popular)),
          topRated: JSON.parse(JSON.stringify(topRated)),
          upcoming: JSON.parse(JSON.stringify(upcoming))
        }} 
      />
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return <Home initialData={{
      trending: { results: [] },
      popular: { results: [] },
      topRated: { results: [] },
      upcoming: { results: [] }
    }} />;
  }
}
