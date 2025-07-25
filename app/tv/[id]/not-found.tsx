'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
  const params = useParams<{ id: string }>();
  const tvShowId = params?.id ? String(params.id).split('-')[0] : null; // Extract just the ID part from the slug
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">TV Show Not Found</h2>
        <p className="text-xl text-gray-300 mb-4">
          The TV show you're looking for doesn't exist or has been removed.
        </p>
        {tvShowId && (
          <p className="text-gray-400 mb-6">
            TV Show ID: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{tvShowId}</span>
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/tv" 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
          >
            Browse TV Shows
          </Link>
          
          <Link 
            href="/" 
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
          >
            Go Home
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link 
            href="/tv/popular" 
            className="block p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <h4 className="font-medium">Popular TV Shows</h4>
            <p className="text-sm text-gray-400">Trending now</p>
          </Link>
          
          <Link 
            href="/tv/top-rated" 
            className="block p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <h4 className="font-medium">Top Rated</h4>
            <p className="text-sm text-gray-400">Highest rated shows</p>
          </Link>
          
          <Link 
            href="/tv/airing-today" 
            className="block p-6 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <h4 className="font-medium">Airing Today</h4>
            <p className="text-sm text-gray-400">Currently on air</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
