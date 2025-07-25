import { notFound } from 'next/navigation';
import { getTVShowDetails } from '@/lib/tmdb';
import { getTVSeasonDetails } from '@/lib/tmdb';

interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  still_path: string | null;
}
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface TVSeasonPageProps {
  params: {
    id: string;
    seasonNumber: string;
  };
}

export default async function TVSeasonPage({ params }: TVSeasonPageProps) {
  const { id, seasonNumber } = params;
  
  try {
    const [showDetails, seasonDetails] = await Promise.all([
      getTVShowDetails(id),
      getTVSeasonDetails(id, seasonNumber)
    ]);

    if (!seasonDetails.episodes || seasonDetails.episodes.length === 0) {
      return notFound();
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={seasonDetails.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
                    : '/placeholder-poster.jpg'}
                  alt={`${showDetails.name} - Season ${seasonNumber}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold">{showDetails.name}</h1>
                <h2 className="text-xl text-gray-300">Season {seasonNumber}</h2>
                {seasonDetails.air_date && (
                  <p className="text-gray-400">
                    {new Date(seasonDetails.air_date).getFullYear()}
                    {seasonDetails.episodes && ` • ${seasonDetails.episodes.length} Episodes`}
                  </p>
                )}
                {seasonDetails.overview && (
                  <p className="mt-4 text-gray-300">{seasonDetails.overview}</p>
                )}
              </div>
            </div>

            <div className="w-full md:w-3/4">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Episodes</h3>
                <div className="space-y-4">
                  {seasonDetails.episodes.map((episode: Episode) => (
                    <div key={episode.id} className="flex gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                      <div className="relative w-1/4 aspect-video flex-shrink-0">
                        <Image
                          src={episode.still_path 
                            ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                            : '/placeholder-backdrop.jpg'}
                          alt={`${episode.name} - ${showDetails.name}`}
                          fill
                          className="object-cover rounded"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">
                            {episode.episode_number}. {episode.name}
                          </h4>
                          {episode.vote_average > 0 && (
                            <div className="flex items-center text-yellow-400">
                              <span className="mr-1">★</span>
                              <span>{episode.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        {episode.air_date && (
                          <p className="text-sm text-gray-400">
                            {formatDate(episode.air_date)}
                          </p>
                        )}
                        <p className="mt-2 text-gray-300 line-clamp-2">
                          {episode.overview || 'No overview available.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching season details:', error);
    return notFound();
  }
}

export async function generateMetadata({ params }: TVSeasonPageProps) {
  const { id, seasonNumber } = params;
  
  try {
    const [showDetails, seasonDetails] = await Promise.all([
      getTVShowDetails(id),
      getTVSeasonDetails(id, seasonNumber)
    ]);

    return {
      title: `${showDetails.name} - Season ${seasonNumber} | 123Movies`,
      description: seasonDetails.overview || `Watch ${showDetails.name} Season ${seasonNumber} on 123Movies`,
      openGraph: {
        images: [
          {
            url: seasonDetails.poster_path 
              ? `https://image.tmdb.org/t/p/w500${seasonDetails.poster_path}`
              : '/placeholder-poster.jpg',
            width: 500,
            height: 750,
            alt: `${showDetails.name} - Season ${seasonNumber}`,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Season Not Found | 123Movies',
      description: 'The requested season could not be found.',
    };
  }
}
