'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  getMovieDetails, 
  getMovieVideos, 
  getTVShowDetails, 
  getTVShowVideos 
} from '../../../../lib/tmdb';
import { Movie, TVShow, TVShowDetails, Video } from '../../../../types';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function WatchPage() {
  const params = useParams();
  const { type, id } = params as { type: string; id: string };
  
  const [media, setMedia] = useState<Movie | TVShowDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (type === 'movie') {
          const [movieData, videosData] = await Promise.all([
            getMovieDetails(id),
            getMovieVideos(id),
          ]);
          setMedia(movieData);
          setVideos(videosData);
        } else if (type === 'tv') {
          const [tvShowData, videosData] = await Promise.all([
            getTVShowDetails(id),
            getTVShowVideos(id),
          ]);
          setMedia(tvShowData);
          setVideos(videosData);
        } else {
          throw new Error('Invalid media type');
        }
      } catch (err) {
        console.error('Error fetching media data:', err);
        setError('Failed to load media data. Please try again later.');
        console.error('Error fetching movie data:', err);
        setError('Failed to load movie data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchData();
    }
  }, [id, type]);

  // Find the first available trailer or teaser
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Content</h1>
        <p className="text-gray-400 mb-6">{error || 'Movie not found'}</p>
        <Link 
          href="/" 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Backdrop */}
      <div className="relative h-screen w-full">
        {media.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${media.backdrop_path})`,
                filter: 'brightness(0.3)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          </div>
        )}

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Link 
            href={`/${type}/${media?.id}`}
            className="bg-black/70 hover:bg-black/90 rounded-full p-2 transition"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {'title' in media ? media.title : media.name}
            </h1>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3">{media.overview}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Link 
                href={`/${type}/${media.id}`}
                className="flex items-center bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                View Details
              </Link>
            </div>
          </div>

          {/* Video Player Placeholder */}
          {trailer ? (
            <div className="mt-8 aspect-video w-full max-w-4xl mx-auto bg-black/50 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mt-8 aspect-video w-full max-w-4xl mx-auto bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-4">No trailer available</p>
                <p className="text-sm text-gray-500">This content might not be available in your region</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
