'use client';

import React, { useCallback, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie, TVShow } from '../types';

interface MovieGridProps {
  movies: (Movie | TVShow)[];
  title?: string;
  type?: 'movie' | 'tv';
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  title,
  type = 'movie',
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
}) => {
  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  }, [onPageChange]);

  // Auto-scroll to top when page changes
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Loading state
  if (loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-xl text-gray-400 mb-4">No {type === 'movie' ? 'movies' : 'TV shows'} found</h3>
        <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>}
      
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((item) => {
          // Determine the correct type for the item
          const itemType = (item as TVShow).name ? 'tv' : 'movie';
          return (
            <MovieCard 
              key={`${itemType}-${item.id}`}
              movie={item}
              type={itemType}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show first, last and current page with neighbors
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-red-600 text-white border-red-600 z-10'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } ${i === 0 ? 'border-l-0' : ''}`}
                  disabled={loading}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages || loading}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
          
          {totalPages > 5 && (
            <div className="ml-4 flex items-center text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
      )}
      
      {/* Loading indicator at bottom */}
      {loading && movies.length > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
