import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { mapCariPaymentType, writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

const PAYMENT_COLORS = ['#0f766e', '#2563eb', '#7c3aed', '#ea580c', '#be123c', '#475569'];

function normalizeName(value: unknown) {
  return String(value || '').trim();
}

function getPaymentUsage(entries: Array<{ paymentBreakdown: unknown }>) {
  const usage = new Map<string, number>();

  entries.forEach((entry) => {
    if (!entry.paymentBreakdown || typeof entry.paymentBreakdown !== 'object' || Array.isArray(entry.paymentBreakdown)) return;

    Object.entries(entry.paymentBreakdown as Record<string, unknown>).forEach(([name, value]) => {
      if (Number(value || 0) > 0) usage.set(name, (usage.get(name) || 0) + 1);
    });
  });

  return usage;
}

export async function GET() {
  try {
    await requireCariSession();

    const [types, entries] = await Promise.all([
      prisma.cariPaymentType.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
      prisma.cariEntry.findMany({ select: { paymentBreakdown: true } }),
    ]);
    const usage = getPaymentUsage(entries);

    return NextResponse.json(types.map((type) => mapCariPaymentType(type, usage.get(type.name) || 0)));
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Payment types could not be loaded.' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCariSession();
    const body = await request.json().catch(() => ({}));
    const name = normalizeName(body.name);

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    const count = await prisma.cariPaymentType.count();
    const type = await prisma.cariPaymentType.create({
      data: {
        name,
        color: PAYMENT_COLORS[count % PAYMENT_COLORS.length],
        sortOrder: 100 + count,
        createdBy: session.id.startsWith('fallback-') ? null : session.id,
        createdByName: session.name,
      },
    });

    await writeCariLog(session, 'Tahsilat türü eklendi', `${name} tahsilat türü eklendi.`, request);
    return NextResponse.json(mapCariPaymentType(type), { status: 201 });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    const status = code === 'P2002' ? 409 : error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Payment type could not be saved.' }, { status });
  }
}
