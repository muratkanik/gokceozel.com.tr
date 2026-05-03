import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

type GoogleReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
};

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

async function resolvePlaceId(apiKey: string) {
  const configured = process.env.GOOGLE_PLACE_ID || process.env.GOOGLE_PLACES_PLACE_ID;
  if (configured) return configured;

  const query = process.env.GOOGLE_PLACE_SEARCH_TEXT || 'Prof. Dr. Gökçe Özel Ankara';
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('language', 'tr');

  const response = await fetch(url);
  const payload = await response.json();
  const placeId = payload.results?.[0]?.place_id;
  if (!placeId) throw new Error('Google Place ID bulunamadı.');
  return placeId;
}

export async function POST() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: 'Google yorumlarını çekmek için GOOGLE_PLACES_API_KEY veya GOOGLE_MAPS_API_KEY tanımlanmalı.',
    }, { status: 400 });
  }

  try {
    const placeId = await resolvePlaceId(apiKey);
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
    url.searchParams.set('language', 'tr');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url, { cache: 'no-store' });
    const payload = await response.json();
    if (payload.status && payload.status !== 'OK') {
      return NextResponse.json({ error: payload.error_message || `Google API hatası: ${payload.status}` }, { status: 502 });
    }

    const reviews: GoogleReview[] = payload.result?.reviews || [];
    let imported = 0;
    let skipped = 0;

    for (const review of reviews) {
      const author = String(review.author_name || 'Google kullanıcısı').trim();
      const text = String(review.text || '').trim();
      const rating = Number(review.rating || 5);
      if (!text) {
        skipped += 1;
        continue;
      }

      const exists = await prisma.testimonial.findFirst({
        where: {
          author,
          text,
          source: 'Google',
        },
        select: { id: true },
      });

      if (exists) {
        skipped += 1;
        continue;
      }

      await prisma.testimonial.create({
        data: {
          author,
          rating,
          locale: 'tr',
          text,
          source: 'Google',
          approved: true,
          createdAt: review.time ? new Date(review.time * 1000) : new Date(),
        },
      });
      imported += 1;
    }

    return NextResponse.json({
      ok: true,
      imported,
      skipped,
      placeName: payload.result?.name || null,
      placeRating: payload.result?.rating || null,
      totalGoogleReviews: payload.result?.user_ratings_total || null,
      note: 'Google Places Details API öne çıkan sınırlı sayıdaki yorumu döndürür. Tüm yorum arşivi için Google Business Profile API erişimi gerekir.',
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Google yorumları içe aktarılamadı.',
    }, { status: 500 });
  }
}
