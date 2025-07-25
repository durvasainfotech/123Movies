import React from 'react';
import { notFound } from 'next/navigation';
import { 
  getTVShowDetails, 
  getTVShowCredits, 
  getTVShowVideos, 
  getTVShowReviews, 
  getTVShowImages, 
  getSimilarTVShows, 
  getTVShowRecommendations
} from '@/lib/tmdb';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, CalendarIcon, ClockIcon, FilmIcon, UserGroupIcon, TvIcon } from '@heroicons/react/24/solid';
import { formatDate } from '@/lib/utils';
import MovieCard from '@/components/MovieCard';
import type { 
  TVShow, 
  TVShowDetails, 
  Video, 
  Review, 
  Credit, 
  Genre, 
  Image as TMDBImage,
  MovieCreditsResponse,
  MovieImagesResponse,
  TVShowListResponse
} from '@/types';

interface TVSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  overview: string;
}

interface TVShowPageProps {
  params: {
    id: string;
  };
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const tvShowId = params.id;
  
  try {
    // Fetch all TV show data in parallel
    const [
      tvShow,
      credits,
      videos,
      reviews,
      images,
      similarShows,
      recommendations
    ] = await Promise.all([
      getTVShowDetails(tvShowId),
      getTVShowCredits(tvShowId),
      getTVShowVideos(tvShowId),
      getTVShowReviews(tvShowId),
      getTVShowImages(tvShowId),
      getSimilarTVShows(tvShowId),
      getTVShowRecommendations(tvShowId)
    ]) as [
      TVShowDetails,
      MovieCreditsResponse,
      Video[],
      { results: Review[] },
      MovieImagesResponse,
      TVShowListResponse,
      TVShowListResponse
    ];

    // Find the first trailer
    const trailer = videos.find((video: Video) => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    // Get the creator (for TV shows, we look for creators instead of directors)
    const creator = credits.crew.find(
      (member: Credit) => member.job === 'Creator' || member.job === 'Executive Producer'
    );

    // Get writers
    const writers = credits.crew.filter(
      (member: Credit) => member.department === 'Writing' || member.known_for_department === 'Writing'
    );

    // Get main cast (first 10)
    const mainCast = credits.cast.slice(0, 10);
    
    // Get backdrops from images
    const backdrops = (images.backdrops || []).slice(0, 5);

    return (
      <div className="bg-gray-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Backdrop */}
        <div className="relative h-96 w-full">
          {tvShow.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
              alt={tvShow.name}
              fill
              className="object-cover opacity-30"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="w-64 flex-shrink-0 -mt-16 hidden md:block">
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={
                      tvShow.poster_path
                        ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                        : '/no-poster.png'
                    }
                    alt={tvShow.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{tvShow.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                  {tvShow.first_air_date && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-red-500" />
                      {new Date(tvShow.first_air_date).getFullYear()}
                      {tvShow.last_air_date && ` - ${new Date(tvShow.last_air_date).getFullYear()}`}
                    </div>
                  )}
                  
                  {tvShow.episode_run_time && tvShow.episode_run_time.length > 0 && (
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-red-500" />
                      {tvShow.episode_run_time[0]}m per episode
                    </div>
                  )}
                  
                  {tvShow.number_of_seasons > 0 && (
                    <div className="flex items-center">
                      <TvIcon className="h-4 w-4 mr-1 text-red-500" />
                      {tvShow.number_of_seasons} {tvShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    {tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A'}
                    <span className="text-gray-500 text-xs ml-1">({tvShow.vote_count})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tvShow.genres.map((genre: Genre) => (
                    <span 
                      key={genre.id}
                      className="px-2 py-1 bg-gray-800 rounded-full text-xs font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <p className="text-gray-300">{tvShow.overview || 'No overview available.'}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {creator && (
                      <div>
                        <h3 className="text-sm text-gray-400">Creator</h3>
                        <p>
                          <a href={`https://www.themoviedb.org/person/${creator.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{creator.name}</a>
                        </p>
                      </div>
                    )}
                    
                    {tvShow.networks && tvShow.networks.length > 0 && (
                      <div>
                        <h3 className="text-sm text-gray-400">Network</h3>
                        <p>{tvShow.networks[0].name}</p>
                      </div>
                    )}
                    
                    {tvShow.status && (
                      <div>
                        <h3 className="text-sm text-gray-400">Status</h3>
                        <p>{tvShow.status}</p>
                      </div>
                    )}
                    
                    {tvShow.original_language && (
                      <div>
                        <h3 className="text-sm text-gray-400">Original Language</h3>
                        <p>{tvShow.original_language.toUpperCase()}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {trailer && (
                  <div className="mt-6">
                    <Link
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors"
                    >
                      <FilmIcon className="h-5 w-5 mr-2" />
                      Watch Trailer
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          {/* Cast */}
          {mainCast.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {mainCast.map((person: Credit) => (
                  <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                            : '/no-avatar.png'
                        }
                        alt={person.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">
                        <a href={`https://www.themoviedb.org/person/${person.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{person.name}</a>
                      </h3>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {credits.cast.length > 10 && (
                <div className="mt-4 text-center">
                  <button className="text-red-500 hover:text-red-400 font-medium">
                    View Full Cast & Crew
                  </button>
                </div>
              )}
            </section>
          )}
          
          {/* Seasons */}
          {tvShow.seasons && tvShow.seasons.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Seasons</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tvShow.seasons
                  .filter(season => season && season.season_number > 0) // Skip season 0 (specials)
                  .sort((a, b) => (b?.season_number || 0) - (a?.season_number || 0)) // Sort by newest first
                  .map(season => (
                    <Link 
                      key={season.id} 
                      href={`/tv/${tvShow.id}/season/${season.season_number}`}
                      className="block group"
                    >
                      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                        <div className="aspect-[2/3] relative">
                          <Image
                            src={
                              season.poster_path
                                ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                                : '/no-poster.png'
                            }
                            alt={`${tvShow.name} - ${season.name}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">{season.name}</h3>
                          <p className="text-sm text-gray-400">
                            {season.episode_count} episodes
                          </p>
                          {season.air_date && (
                            <p className="text-xs text-gray-500">
                              {new Date(season.air_date).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          )}
          
          {/* Similar TV Shows */}
          {similarShows.results.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Similar TV Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {similarShows.results.slice(0, 6).map((show: TVShow) => (
                  <MovieCard key={show.id} movie={show} type="tv" />
                ))}
              </div>
            </section>
          )}
          
          {/* Recommendations */}
          {recommendations.results.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recommendations.results.slice(0, 6).map((show: TVShow) => (
                  <MovieCard key={show.id} movie={show} type="tv" />
                ))}
              </div>
            </section>
          )}
          
          {/* Backdrops */}
          {backdrops.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Backdrops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backdrops.map((image: TMDBImage, index: number) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                      alt={`${tvShow.name} backdrop ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    notFound();
  }
}

// Generate static params for the first 100 popular TV shows
export async function generateStaticParams() {
  const { results: popularTVShows } = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  ).then(res => res.json());

  return popularTVShows.slice(0, 100).map((tvShow: { id: number }) => ({
    id: tvShow.id.toString(),
  }));
}
