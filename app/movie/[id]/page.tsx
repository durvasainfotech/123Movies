import React from 'react';
import { notFound } from 'next/navigation';
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieReviews, getMovieImages, getSimilarMovies, getMovieRecommendations } from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, CalendarIcon, ClockIcon, FilmIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { formatDate, formatRuntime } from '@/lib/utils';
import MovieCard from '@/components/MovieCard';
import { Metadata } from 'next';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return {
      title: 'TMDB API Key Required | 123MoviesFlix',
      description: 'Please set up your TMDB API key to view movie details.',
    };
  }
  
  try {
    const movie = await getMovieDetails(params.id);
    
    const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const title = movie.title + (movieYear ? ` (${movieYear})` : '');
    
    return {
      title: `${title} | 123MoviesFlix`,
      description: movie.overview || `Watch ${movie.title} on 123MoviesFlix. ${movie.tagline || ''}`,
      openGraph: {
        title,
        description: movie.overview || `Watch ${movie.title} on 123MoviesFlix`,
        images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Movie Not Found | 123MoviesFlix',
      description: 'The requested movie could not be found.',
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = params.id;
  
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">TMDB API Key Required</h1>
          <p className="text-gray-300 mb-4">
            To view movie details, you need to set up your TMDB API key.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg text-sm">
            <p className="mb-2">1. Get your API key from:</p>
            <a 
              href="https://www.themoviedb.org/settings/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              https://www.themoviedb.org/settings/api
            </a>
            <p className="mt-2">2. Create a <code className="bg-gray-700 px-1 rounded">.env.local</code> file with:</p>
            <code className="block bg-gray-700 p-2 rounded mt-1 text-green-400">
              NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
            </code>
          </div>
        </div>
      </div>
    );
  }
  
  try {
    // Fetch all movie data in parallel
    const [movie, credits, videos, reviews, images, similar, recommendations] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getMovieReviews(movieId),
      getMovieImages(movieId),
      getSimilarMovies(movieId),
      getMovieRecommendations(movieId),
    ]);

    // Get the first trailer video
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    
    // Get director and main cast
    const director = credits.crew.find(member => member.job === 'Director');
    const mainCast = credits.cast.slice(0, 5);

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Backdrop Image */}
        {movie.backdrop_path && (
          <div className="relative h-96 w-full">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title || 'Movie Backdrop'}
              fill
              className="object-cover opacity-30"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
        )}

        {/* Movie Info */}
        <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/no-poster.jpg'}
                  alt={movie.title || 'Movie Poster'}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
              
              {/* Quick Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                </div>
                
                {movie.runtime && (
                  <div className="flex items-center text-sm text-gray-300">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-300">
                  <StarIcon className="w-4 h-4 text-yellow-400 mr-2" />
                  <span>{movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)</span>
                </div>
                {typeof movie.budget === 'number' && movie.budget > 0 && (
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="font-semibold mr-2">Budget:</span>
                    <span>{movie.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                  </div>
                )}
                {typeof movie.revenue === 'number' && movie.revenue > 0 && (
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="font-semibold mr-2">Revenue:</span>
                    <span>{movie.revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
                  </div>
                )}
                {director && (
                  <div className="text-sm text-gray-300">
                    <div className="flex items-start">
                      <UserGroupIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-gray-400">Director: </span>
                        <a href={`https://www.themoviedb.org/person/${director.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{director.name}</a>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span 
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-300">{movie.overview}</p>
              </div>
              
              {/* Trailer */}
              {trailer && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                  <div className="aspect-video w-full max-w-3xl bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              
              {/* Cast */}
              {mainCast.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Top Cast</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mainCast.map(person => (
                      <div key={person.id} className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                          {person.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                              alt={person.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <UserGroupIcon className="w-8 h-8 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium">
                          <a href={`https://www.themoviedb.org/person/${person.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{person.name}</a>
                        </h3>
                        <p className="text-sm text-gray-400">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Similar Movies */}
          {similar.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {similar.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
          
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Recommended Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recommendations.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }
}

// Generate static params for the first 100 popular movies
export async function generateStaticParams() {
  // Check if API key is available
  if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    console.warn('TMDB API key not found, skipping static generation');
    return [];
  }
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch popular movies for static generation');
      return [];
    }
    
    const data = await response.json();
    
    return data.results.map((movie: { id: number }) => ({
      id: movie.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
} 