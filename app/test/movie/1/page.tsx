import React from 'react';
import MoviePage from '../../../../app/movie/[id]/page';

export default async function TestMoviePage() {
  // Test with a popular movie ID (The Dark Knight)
  const movieId = '155';
  
  // The MoviePage component fetches its own data, so we don't need to fetch here
  // We just need to pass the correct params
  return <MoviePage params={{ id: movieId }} />;
}
