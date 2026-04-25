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

  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ redirects });
}

export async function POST(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { fromPath, toPath, statusCode = 301, locale = null } = await req.json();
  if (!fromPath || !toPath) return NextResponse.json({ error: 'fromPath ve toPath zorunlu' }, { status: 400 });

  const redirect = await prisma.redirect.upsert({
    where: { fromPath },
    update: { toPath, statusCode, locale },
    create: { fromPath, toPath, statusCode, locale },
  });
  return NextResponse.json({ redirect });
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id zorunlu' }, { status: 400 });

  await prisma.redirect.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
