import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Backdrop Skeleton */}
      <div className="h-96 bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            {/* Poster Skeleton */}
            <div className="w-64 h-96 bg-gray-700 rounded-lg -mt-16 hidden md:block"></div>
            
            {/* Info Skeleton */}
            <div className="flex-1">
              <div className="h-12 bg-gray-700 rounded w-3/4 mb-4"></div>
              
              <div className="flex gap-4 mb-6">
                <div className="h-5 w-20 bg-gray-700 rounded"></div>
                <div className="h-5 w-20 bg-gray-700 rounded"></div>
                <div className="h-5 w-20 bg-gray-700 rounded"></div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>
              
              <div className="mt-6 h-10 w-40 bg-gray-700 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-800 rounded mb-6"></div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-gray-700"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-8 w-48 bg-gray-800 rounded mb-6"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
