import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Search query is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://streaming-availability.p.rapidapi.com/v2/search/title?title=${encodeURIComponent(query)}&country=us&show_type=all&output_language=en`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from RapidAPI');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Netflix search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Netflix shows' },
      { status: 500 }
    );
  }
}
