import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlValueLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
  });
}
