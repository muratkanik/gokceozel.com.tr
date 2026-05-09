import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['google_maps_api_key', 'google_place_id'] }
      }
    });

    const apiKey = settings.find(s => s.key === 'google_maps_api_key')?.value;
    const placeId = settings.find(s => s.key === 'google_place_id')?.value;

    if (!apiKey || !placeId) {
      return NextResponse.json({ error: 'Google Places API Key or Place ID not configured' }, { status: 400 });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&language=en&key=${apiKey}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Google' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
