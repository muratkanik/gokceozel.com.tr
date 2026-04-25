import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function GET() {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { author, rating, locale, text, source = null, approved = false } = await req.json();
  if (!author || !rating || !locale || !text) {
    return NextResponse.json({ error: 'author, rating, locale, text zorunlu' }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: { author, rating: Number(rating), locale, text, source, approved },
  });
  return NextResponse.json({ testimonial });
}

export async function PATCH(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, approved } = await req.json();
  if (!id || approved === undefined) {
    return NextResponse.json({ error: 'id ve approved zorunlu' }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: { approved },
  });
  return NextResponse.json({ testimonial });
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });

  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
