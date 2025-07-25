'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TV Show Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-xl text-gray-300 mb-8">
          We're having trouble loading this TV show. Please try again later.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
          >
            Try Again
          </button>
          
          <a
            href="/tv"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
          >
            Browse TV Shows
          </a>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-left">
          <h3 className="font-semibold mb-2">Error Details:</h3>
          <code className="text-sm text-red-400 break-all">
            {error.message}
          </code>
        </div>
      </div>
    </div>
  );
}
