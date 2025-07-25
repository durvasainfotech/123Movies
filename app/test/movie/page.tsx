'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestMoviePage() {
  const router = useRouter();
  type TestResult = {
    test: string;
    status: 'pass' | 'fail' | 'running';
    message: string;
  };

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    const results: TestResult[] = [];
    
    // Test 1: Check if TMDB API key is set
    try {
      const response = await fetch('/api/test/movie');
      const data = await response.json();
      
      if (data.success && data.data) {
        results.push({
          test: 'TMDB API Connection',
          status: 'pass',
          message: 'Successfully connected to TMDB API',
        });
      } else {
        results.push({
          test: 'TMDB API Connection',
          status: 'fail',
          message: 'Failed to connect to TMDB API',
        });
      }
    } catch (error) {
      results.push({
        test: 'TMDB API Connection',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    // Test 2: Check if movie details page loads
    try {
      const response = await fetch('/movie/155-the-dark-knight'); // The Dark Knight
      if (response.ok) {
        results.push({
          test: 'Movie Details Page',
          status: 'pass',
          message: 'Movie details page loaded successfully',
        });
      } else {
        results.push({
          test: 'Movie Details Page',
          status: 'fail',
          message: `Failed to load movie details page: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error) {
      results.push({
        test: 'Movie Details Page',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Movie App Tests</h1>
      
      <div className="mb-8">
        <button
          onClick={runTests}
          disabled={isTesting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {isTesting ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Test Results</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.status === 'pass' ? 'bg-green-900/50' : 'bg-red-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.test}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      result.status === 'pass' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">{result.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/movie/155-the-dark-knight')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left"
          >
            <h3 className="font-medium">The Dark Knight</h3>
            <p className="text-sm text-gray-400">Test Movie Details Page</p>
          </button>
          <button
            onClick={() => router.push('/')}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left"
          >
            <h3 className="font-medium">Home Page</h3>
            <p className="text-sm text-gray-400">Return to home</p>
          </button>
        </div>
      </div>
    </div>
  );
}
