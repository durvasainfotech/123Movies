"use client";

import React, { useEffect, useState } from 'react';
import MovieGrid from '../../components/MovieGrid';
import { getPopularMovies } from '../../lib/tmdb';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Movie } from '../../types';

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setLoading(true);
    getPopularMovies(page).then((res) => {
      setMovies(res.results);
      setTotalPages(res.total_pages > 500 ? 500 : res.total_pages); // TMDB API max 500 pages
      setLoading(false);
    });
  }, [page]);

  const goToPage = (p: number) => {
    router.push(`/movies?page=${p}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Movies</h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <MovieGrid movies={movies} />
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex items-center space-x-1">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            // Show up to 10 pages, center current page if possible
            let p = i + 1;
            if (page > 5 && totalPages > 10) {
              p = page - 5 + i;
              if (p < 1) p = i + 1;
              if (p > totalPages - 9) p = totalPages - 9 + i;
            }
            if (p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 rounded ${p === page ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200'} mx-1`}
                disabled={p === page}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
