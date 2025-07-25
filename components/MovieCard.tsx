'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { Movie, TVShow } from '../types';

type MediaItem = Movie | TVShow;

// Type guard to check if the item is a TV show
const isTVShow = (item: MediaItem): item is TVShow => {
  return (item as TVShow).name !== undefined;
};

interface MovieCardProps {
  movie: MediaItem;
  type?: 'movie' | 'tv';
  showType?: boolean;
}

const MovieCard = ({ movie, type, showType = false }: MovieCardProps) => {
  // Determine the media type based on props or the actual data
  const mediaType = type || (isTVShow(movie) ? 'tv' : 'movie');
  
  // Safely get properties that might be on either Movie or TVShow
  const title = isTVShow(movie) ? movie.name : movie.title;
  const releaseDate = isTVShow(movie) ? movie.first_air_date : movie.release_date;
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : 'NR';
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-poster.svg';
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  // Generate URLs based on media type
  const mediaUrl = `/${mediaType}/${movie.id}`;
  const playUrl = `/watch/${mediaType}/${movie.id}`;

  // Adsterra popunder trigger on first movie click
  const handleMovieClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('adsterraPopunderShown')) {
      sessionStorage.setItem('adsterraPopunderShown', 'true');
      // Optionally, you can try to trigger the ad script here if needed
      // The Adsterra script should auto-handle popunder on click if loaded globally
    }
    // Let the navigation proceed
  };

  return (
    <div className="group relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/50">
      <div className="relative aspect-[2/3] w-full">
        <Link href={mediaUrl} className="block h-full" onClick={handleMovieClick}>
          <Image
            src={posterPath}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchW5AAAAABJRU5ErkJggg=="
            unoptimized
          />
        </Link>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full max-w-[90%] space-y-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link 
                href={playUrl}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium text-sm transition flex items-center justify-center flex-1 max-w-[120px]"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Now
              </Link>
              <Link 
                href={mediaUrl}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium text-sm transition flex items-center justify-center flex-1 max-w-[120px]"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Details
              </Link>
            </div>
            <div className="flex items-center justify-center text-white text-sm">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="font-semibold">{rating}</span>
              <span className="mx-2">•</span>
              <span>{releaseYear || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        {showType && (
          <span className="text-xs font-medium text-blue-400 mb-1 inline-block">
            {mediaType === 'movie' ? 'MOVIE' : 'TV SHOW'}
          </span>
        )}
        <Link href={mediaUrl} className="block">
          <h3 className="font-medium text-white line-clamp-2 mb-1 hover:text-red-400 transition">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-gray-400">
            {releaseYear || 'N/A'}
            {showType && (
              <span className="ml-2 px-2 py-0.5 bg-gray-700 rounded-md text-xs">
                {mediaType === 'movie' ? 'Movie' : 'TV'}
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
