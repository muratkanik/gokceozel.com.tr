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

  const faqs = await prisma.faq.findMany({
    where: { pageId: null },
    orderBy: [{ locale: 'asc' }, { sortOrder: 'asc' }],
  });
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { question, answer, locale, sortOrder = 0 } = await req.json();
  if (!question || !answer || !locale) {
    return NextResponse.json({ error: 'question, answer, locale zorunlu' }, { status: 400 });
  }

  const faq = await prisma.faq.create({
    data: { question, answer, locale, sortOrder, pageId: null },
  });
  return NextResponse.json({ faq });
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });

  await prisma.faq.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
