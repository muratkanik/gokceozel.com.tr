import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { requireCariSession } from '@/lib/cari-auth';
import { mapCariEntry, writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

function amount(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cleanText(value: unknown) {
  return String(value || '').trim();
}

function cleanList(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean)
    : [];
}

function paymentBreakdown(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, rawValue]) => [cleanText(key), amount(rawValue)] as const)
      .filter(([key, rawValue]) => key && rawValue > 0)
  );
}

function entryDate(value: unknown) {
  const date = cleanText(value) || new Date().toISOString().slice(0, 10);
  return new Date(`${date.slice(0, 10)}T00:00:00.000Z`);
}

export async function GET() {
  try {
    await requireCariSession();

    const entries = await prisma.cariEntry.findMany({
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(entries.map(mapCariEntry));
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Entries could not be loaded.' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCariSession();
    const body = await request.json();
    const payments = paymentBreakdown(body.payments);
    const serviceType = cleanText(body.serviceType) || 'Muayene';
    const patientName = cleanText(body.patient);
    const procedureName = cleanText(body.procedure);

    if (!patientName || !procedureName) {
      return NextResponse.json({ error: 'Patient and procedure are required.' }, { status: 400 });
    }

    await prisma.cariServiceType.upsert({
      where: { name: serviceType },
      update: {},
      create: {
        name: serviceType,
        createdBy: session.id.startsWith('fallback-') ? null : session.id,
        createdByName: session.name,
      },
    });

    await Promise.all(
      Object.keys(payments).map((name, index) =>
        prisma.cariPaymentType.upsert({
          where: { name },
          update: {},
          create: {
            name,
            sortOrder: 100 + index,
            createdBy: session.id.startsWith('fallback-') ? null : session.id,
            createdByName: session.name,
          },
        })
      )
    );

    const entry = await prisma.cariEntry.create({
      data: {
        entryDate: entryDate(body.date),
        patientName,
        phone: cleanText(body.phone) || null,
        serviceType,
        procedureName,
        diagnosis: cleanText(body.diagnosis) || null,
        packageName: cleanText(body.packageName) || null,
        hospital: cleanText(body.hospital) || null,
        hasInsurance: Boolean(body.hasInsurance),
        insuranceProviders: cleanList(body.insuranceProviders),
        insuranceAmount: amount(body.insurance),
        cashAmount: amount(body.cash),
        cardAmount: amount(body.card),
        ibanAmount: amount(body.iban),
        expenseAmount: amount(body.expense),
        paymentBreakdown: payments as Prisma.InputJsonValue,
        note: cleanText(body.note) || null,
        createdBy: session.id.startsWith('fallback-') ? null : session.id,
        createdByName: session.name,
      },
    });

    await writeCariLog(session, 'Kayıt eklendi', `${patientName} için ${procedureName} kaydı oluşturuldu.`, request);

    return NextResponse.json(mapCariEntry(entry), { status: 201 });
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Entry could not be saved.' }, { status });
  }
}
