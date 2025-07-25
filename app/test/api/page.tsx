'use client';

import React, { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    data: any;
    error: string | null;
  }>({
    status: 'idle',
    data: null,
    error: null,
  });

  const testApi = async () => {
    setTestResult({ status: 'loading', data: null, error: null });
    
    try {
      const response = await fetch('/api/test/movie');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch movie data');
      }
      
      setTestResult({
        status: 'success',
        data: data.data,
        error: null,
      });
    } catch (error) {
      setTestResult({
        status: 'error',
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">API Test</h1>
      
      <div className="mb-8">
        <button
          onClick={testApi}
          disabled={testResult.status === 'loading'}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
        >
          {testResult.status === 'loading' ? 'Testing...' : 'Test Again'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          
          {testResult.status === 'loading' && (
            <div className="text-yellow-400">Testing API connection...</div>
          )}
          
          {testResult.status === 'error' && (
            <div className="text-red-400">
              <p className="font-medium">Error:</p>
              <p className="mt-1">{testResult.error}</p>
              <p className="mt-4 text-sm text-gray-400">
                Make sure you have set the TMDB API key in your .env.local file
              </p>
            </div>
          )}
          
          {testResult.status === 'success' && (
            <div>
              <div className="flex items-center text-green-400 mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>API connection successful!</span>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Movie Data:</h3>
                <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">API Endpoint</h2>
          <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">
              GET /api/test/movie
            </code>
          </div>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Response Format:</h3>
          <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`{
  "success": boolean,
  "data": {
    // Movie details object
  },
  "error": string | null
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
