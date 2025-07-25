import { 
  getPopularMovies, 
  getTrendingMovies, 
  getTopRatedMovies, 
  getUpcomingMovies 
} from '@/lib/tmdb';

// This function runs on the server at build time
export async function getStaticProps() {
  try {
    const [trending, popular, topRated, upcoming] = await Promise.all([
      getTrendingMovies('week'),
      getPopularMovies(1),
      getTopRatedMovies(1),
      getUpcomingMovies(1)
    ]);
    
    return {
      props: {
        initialData: JSON.stringify({
          trending: trending,
          popular: popular,
          topRated: topRated,
          upcoming: upcoming
        })
      },
      // Revalidate every 24 hours
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialData: JSON.stringify({
          trending: { page: 1, results: [], total_pages: 0, total_results: 0 },
          popular: { page: 1, results: [], total_pages: 0, total_results: 0 },
          topRated: { page: 1, results: [], total_pages: 0, total_results: 0 },
          upcoming: { page: 1, results: [], total_pages: 0, total_results: 0 }
        })
      }
    };
  }
}
