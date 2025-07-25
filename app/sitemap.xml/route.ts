import { NextResponse } from 'next/server';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
} from '@/lib/tmdb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://123moviesflix.info';
const CACHE_DURATION = 3600; // 1 hour in seconds
const MAX_URLS_PER_SITEMAP = 45000; // Buffer under 50k limit
const API_TIMEOUT = 5000; // 5 seconds timeout

// Static routes configuration
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/movies', priority: '0.9', changefreq: 'daily' },
  { path: '/tv', priority: '0.9', changefreq: 'daily' },
  { path: '/trending', priority: '0.8', changefreq: 'daily' },
  { path: '/search', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/dmca', priority: '0.3', changefreq: 'yearly' },
];

// Utility functions
const formatUrl = (path: string) => `${BASE_URL}${path}`;

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

const getLastModDate = (type: 'static' | 'movie' | 'tv') => {
  const now = new Date();
  switch (type) {
    case 'static':
      // Static pages don't change often
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'movie':
    case 'tv':
      // Dynamic content is fresh
      return now.toISOString();
    default:
      return now.toISOString();
  }
};

const getChangeFreq = (url: string) => {
  if (url === formatUrl('/')) return 'daily';
  if (url.includes('/movie/') || url.includes('/tv/')) return 'weekly';
  if (url.includes('/trending') || url.includes('/movies') || url.includes('/tv')) return 'daily';
  return 'monthly';
};

const getPriority = (url: string) => {
  if (url === formatUrl('/')) return '1.0';
  if (url.includes('/movies') || url.includes('/tv') || url.includes('/trending')) return '0.9';
  if (url.includes('/movie/') || url.includes('/tv/')) return '0.8';
  return '0.5';
};

// API call with timeout
const fetchWithTimeout = async <T>(
  fetchFn: () => Promise<T>,
  timeout: number = API_TIMEOUT
): Promise<T | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const result = await fetchFn();
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('API fetch failed:', error);
    return null;
  }
};

// Generate sitemap XML
const generateSitemapXml = (urls: Array<{
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}>) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`)
    .join('\n')}
</urlset>`;
  
  return xml;
};

// Generate fallback sitemap with static routes only
const generateStaticSitemap = () => {
  const urls = staticRoutes.map((route) => ({
    url: formatUrl(route.path),
    lastmod: getLastModDate('static'),
    changefreq: route.changefreq,
    priority: route.priority,
  }));
  
  return generateSitemapXml(urls);
};

// Deduplicate items by ID
const deduplicateById = <T extends { id: number }>(items: T[]): T[] => {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Start with static routes
    const urls = staticRoutes.map((route) => ({
      url: formatUrl(route.path),
      lastmod: getLastModDate('static'),
      changefreq: route.changefreq,
      priority: route.priority,
    }));

    // Only fetch dynamic content if API key is available
    if (process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      console.log('Fetching dynamic content for sitemap...');
      
      // Fetch all data concurrently with timeout protection
      const results = await Promise.allSettled([
        fetchWithTimeout(() => getTrendingMovies()),
        fetchWithTimeout(() => getPopularMovies()),
        fetchWithTimeout(() => getTopRatedMovies()),
        fetchWithTimeout(() => getUpcomingMovies()),
        fetchWithTimeout(() => getTrendingTVShows()),
        fetchWithTimeout(() => getPopularTVShows()),
        fetchWithTimeout(() => getTopRatedTVShows()),
      ]);

      // Extract successful results
      const [
        trendingMovies,
        popularMovies,
        topRatedMovies,
        upcomingMovies,
        trendingTVShows,
        popularTVShows,
        topRatedTVShows,
      ] = results.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );

      // Process movies
      const allMovies = [
        ...(trendingMovies?.results || []),
        ...(popularMovies?.results || []),
        ...(topRatedMovies?.results || []),
        ...(upcomingMovies?.results || []),
      ];
      
      const uniqueMovies = deduplicateById(allMovies);
      const movieUrls = uniqueMovies
        .slice(0, 1000) // Limit to prevent sitemap from being too large
        .map((movie) => ({
          url: formatUrl(`/movie/${movie.id}`),
          lastmod: getLastModDate('movie'),
          changefreq: getChangeFreq(formatUrl(`/movie/${movie.id}`)),
          priority: getPriority(formatUrl(`/movie/${movie.id}`)),
        }));

      // Process TV shows
      const allTVShows = [
        ...(trendingTVShows?.results || []),
        ...(popularTVShows?.results || []),
        ...(topRatedTVShows?.results || []),
      ];
      
      const uniqueTVShows = deduplicateById(allTVShows);
      const tvUrls = uniqueTVShows
        .slice(0, 1000) // Limit to prevent sitemap from being too large
        .map((show) => ({
          url: formatUrl(`/tv/${show.id}`),
          lastmod: getLastModDate('tv'),
          changefreq: getChangeFreq(formatUrl(`/tv/${show.id}`)),
          priority: getPriority(formatUrl(`/tv/${show.id}`)),
        }));

      // Combine all URLs
      urls.push(...movieUrls, ...tvUrls);
      
      console.log(`Added ${movieUrls.length} movies and ${tvUrls.length} TV shows to sitemap`);
    } else {
      console.warn('TMDB API key not found, generating static sitemap only');
    }

    // Check if sitemap is too large
    if (urls.length > MAX_URLS_PER_SITEMAP) {
      console.warn(`Sitemap has ${urls.length} URLs, exceeding recommended limit of ${MAX_URLS_PER_SITEMAP}`);
      // Truncate to fit within limits, prioritizing static routes
      const staticUrls = urls.slice(0, staticRoutes.length);
      const dynamicUrls = urls.slice(staticRoutes.length, MAX_URLS_PER_SITEMAP);
      urls.length = 0;
      urls.push(...staticUrls, ...dynamicUrls);
    }

    const processingTime = Date.now() - startTime;
    console.log(`Sitemap generated successfully in ${processingTime}ms with ${urls.length} URLs`);
    
    // Performance warning
    if (processingTime > 2000) {
      console.warn('Sitemap generation is slow, consider implementing caching');
    }

    const xml = generateSitemapXml(urls);
    
    const headers = {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}, must-revalidate`,
      'Last-Modified': new Date().toUTCString(),
      'X-Robots-Tag': 'noindex, follow',
      'X-Generated-Time': new Date().toISOString(),
      'X-URL-Count': urls.length.toString(),
    };

    return new NextResponse(xml, { 
      status: 200, 
      headers 
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Sitemap generation failed after ${processingTime}ms:`, error);
    
    // Return fallback sitemap with static routes only
    const fallbackXml = generateStaticSitemap();
    
    const headers = {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, max-age=1800, s-maxage=1800, must-revalidate`, // Shorter cache for fallback
      'Last-Modified': new Date().toUTCString(),
      'X-Robots-Tag': 'noindex, follow',
      'X-Generated-Time': new Date().toISOString(),
      'X-Fallback': 'true',
    };

    return new NextResponse(fallbackXml, { 
      status: 200, 
      headers 
    });
  }
}