/**
 * /api/admin/once-sonra
 * BeforeAfter CRUD — Admin only
 *
 * GET    → list all cases (newest first)
 * POST   → create new case
 * PATCH  → toggle isPublic / consent
 * DELETE → delete case
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'all'; // all | public | pending

  const where: Record<string, boolean> = {};
  if (filter === 'public') { where.isPublic = true; where.consent = true; }
  if (filter === 'pending') { where.consent = false; }

  try {
    const cases = await prisma.beforeAfter.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(cases);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { beforeUrl, afterUrl, caption, serviceId, consent, isPublic } = body;

    if (!beforeUrl || !afterUrl) {
      return NextResponse.json({ error: 'beforeUrl ve afterUrl zorunludur' }, { status: 400 });
    }

    const record = await prisma.beforeAfter.create({
      data: {
        beforeUrl,
        afterUrl,
        caption: caption || null,
        serviceId: serviceId || null,
        consent: consent === true,
        isPublic: isPublic === true,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: 'id zorunludur' }, { status: 400 });

    const updated = await prisma.beforeAfter.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id zorunludur' }, { status: 400 });

  try {
    await prisma.beforeAfter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
