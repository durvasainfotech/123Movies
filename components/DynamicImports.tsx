'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Dynamic imports with proper typing
export const DynamicHero = dynamic<{ movies: any[] }>(
  () => import('@/components/Hero').then((mod) => mod.default as ComponentType<{ movies: any[] }>),
  { 
    ssr: true, 
    loading: () => <div className="h-screen bg-gray-800 animate-pulse"></div> 
  }
);

export const DynamicMovieSlider = dynamic<{ movies: any[] }>(
  () => import('@/components/MovieSlider').then((mod) => mod.default as ComponentType<{ movies: any[] }>),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading featured movies...</p>
      </div>
    )
  }
);

export const DynamicMovieGrid = dynamic<{ movies: any[] }>(
  () => import('@/components/MovieGrid').then((mod) => mod.default as ComponentType<{ movies: any[] }>),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading movies...</p>
      </div>
    )
  }
);
