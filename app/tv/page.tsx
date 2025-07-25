import React from 'react';
import MovieGrid from '../../components/MovieGrid';
import { 
  getPopularTVShows, 
  getTopRatedTVShows, 
  getAiringTodayTVShows,
  getOnTheAirTVShows
} from '../../lib/tmdb';

export const revalidate = 3600; // Revalidate every hour

interface SectionProps {
  title: string;
  endpoint: () => Promise<{ results: any[] }>;
}

async function TVShowSection({ title, endpoint }: SectionProps) {
  const { results } = await endpoint();
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <MovieGrid movies={results} type="tv" />
    </section>
  );
}

export default async function TVShowsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">TV Shows</h1>
      
      <TVShowSection 
        title="Popular TV Shows" 
        endpoint={getPopularTVShows} 
      />
      
      <TVShowSection 
        title="Top Rated TV Shows" 
        endpoint={getTopRatedTVShows} 
      />
      
      <TVShowSection 
        title="Airing Today" 
        endpoint={getAiringTodayTVShows} 
      />
      
      <TVShowSection 
        title="Currently Airing" 
        endpoint={getOnTheAirTVShows} 
      />
    </div>
  );
}
