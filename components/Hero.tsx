'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { Movie, TVShow } from '../types';

interface HeroProps {
  movies: (Movie | TVShow)[];
}

const Hero: React.FC<HeroProps> = ({ movies = [] }) => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movies.length > 0) {
      // Use the first movie as the featured movie
      setFeaturedMovie(movies[0]);
      setLoading(false);
    } else {
      // Fallback to mock data if no movies are provided
      const mockMovie = {
        id: 0,
        title: 'No Movies Available',
        overview: 'There are no movies to display at the moment.',
        backdrop_path: '',
        poster_path: '',
        vote_average: 0,
        release_date: '',
      };
      setFeaturedMovie(mockMovie as Movie);
      setLoading(false);
    }
  }, [movies]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-32 h-8 bg-gray-800 rounded mb-4"></div>
          <div className="w-64 h-4 bg-gray-800 rounded mb-2"></div>
          <div className="w-56 h-4 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!featuredMovie) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Featured Movie</h2>
          <p className="text-gray-400">There are no movies to display at the moment.</p>
        </div>
      </div>
    );
  }

  // Type guard to check if the item is a TV show or movie
  // Type guard to check if the item is a TV show
  const isTVShow = (item: Movie | TVShow): item is TVShow => {
    return 'name' in item && 'first_air_date' in item;
  };

  // Get the media type for routing
  const mediaType = isTVShow(featuredMovie) ? 'tv' : 'movie';
  
  // Get the title based on media type
  const title = isTVShow(featuredMovie) ? featuredMovie.name : featuredMovie.title;
  
  // Get the release date based on media type
  const releaseDate = isTVShow(featuredMovie) 
    ? featuredMovie.first_air_date 
    : featuredMovie.release_date;

  return (
    <div className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Backdrop Image */}
      {featuredMovie.backdrop_path && (
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={title}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {'title' in featuredMovie ? featuredMovie.title : featuredMovie.name}
            </h1>
            <div className="flex items-center mb-6">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold mr-4">
                {featuredMovie.vote_average?.toFixed(1)} ★
              </span>
              <span className="text-gray-300">
                {releaseDate?.split('-')[0] || 'N/A'}
              </span>
            </div>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3">
              {featuredMovie.overview}
            </p>
            <div className="flex space-x-4">
              <Link
                href={`/watch/${mediaType}/${featuredMovie.id}`}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Now
              </Link>
              <Link
                href={`/${mediaType}/${featuredMovie.id}`}
                className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
