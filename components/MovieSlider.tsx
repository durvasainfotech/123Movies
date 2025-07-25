'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { MediaItem, Movie, TVShow } from '@/types';

// Type guard to check if the item is a TVShow
function isTVShow(item: MediaItem): item is TVShow {
  return 'name' in item && 'first_air_date' in item;
}

// Helper function to get the release year from a MediaItem
function getReleaseYear(item: MediaItem): string {
  if ('release_date' in item && item.release_date) {
    return item.release_date.split('-')[0];
  }
  if (isTVShow(item) && item.first_air_date) {
    return item.first_air_date.split('-')[0];
  }
  return 'N/A';
}

interface MovieSliderProps {
  movies: MediaItem[];
}

export default function MovieSlider({ movies = [] }: MovieSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayInterval = 5000; // 5 seconds

  // Use a default empty array if no movies are provided
  const slides = movies.length > 0 ? movies : [];

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, autoplayInterval);
      return () => clearInterval(timer);
    }
  }, [isHovered, slides.length]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((movie) => (
          <div key={movie.id} className="w-full flex-shrink-0 relative h-full">
            {/* Backdrop Image */}
            <div className="absolute inset-0">
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={'title' in movie ? movie.title : movie.name || 'Media'}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>

            {/* Movie Info */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
              <h2 className="text-4xl font-bold mb-2">{'title' in movie ? movie.title : movie.name}</h2>
              <div className="flex items-center mb-4">
                <span className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold mr-2">
                  {movie.vote_average?.toFixed(1)} ★
                </span>
                <span className="text-gray-300 text-sm">
                  {getReleaseYear(movie)}
                </span>
              </div>
              <p className="max-w-2xl text-gray-200 mb-6 line-clamp-3">
                {movie.overview}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={`/${'title' in movie ? 'movie' : 'tv'}/${movie.id}`}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Watch Now
                </Link>
                <Link
                  href={`/${'title' in movie ? 'movie' : 'tv'}/${movie.id}/info`}
                  className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
