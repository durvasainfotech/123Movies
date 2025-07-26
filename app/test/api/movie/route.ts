import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('TMDB API key is not set. Please set the NEXT_PUBLIC_TMDB_API_KEY environment variable.');
}

export async function GET() {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'TMDB API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // Test with The Dark Knight movie ID
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/155?api_key=${TMDB_API_KEY}`,
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    
    const movie = await response.json();
    return NextResponse.json({ success: true, data: movie });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch movie details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
