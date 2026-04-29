import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import type { CariSession } from '@/lib/cari-auth';

function numeric(value: number | string | null | undefined) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateString(value: Date | string | null | undefined) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

export function mapCariEntry(row: any) {
  const fallbackPayments = {
    'Sigortadan ödenen': numeric(row.insuranceAmount),
    Nakit: numeric(row.cashAmount),
    Kart: numeric(row.cardAmount),
    'IBAN / havale': numeric(row.ibanAmount),
  };
  const paymentBreakdown = row.paymentBreakdown && typeof row.paymentBreakdown === 'object' && !Array.isArray(row.paymentBreakdown)
    ? row.paymentBreakdown
    : {};
  const payments = Object.fromEntries(
    Object.entries(Object.keys(paymentBreakdown).length ? paymentBreakdown : fallbackPayments)
      .map(([key, value]): [string, number] => [key, numeric(value as any)])
      .filter(([, value]) => value > 0)
  );

  return {
    id: row.id,
    date: toDateString(row.entryDate),
    patient: row.patientName,
    phone: row.phone || '',
    serviceType: row.serviceType,
    procedure: row.procedureName,
    diagnosis: row.diagnosis || '',
    packageName: row.packageName || '',
    hospital: row.hospital || '',
    hasInsurance: Boolean(row.hasInsurance),
    insuranceProviders: row.insuranceProviders || [],
    insurance: numeric(row.insuranceAmount),
    cash: numeric(row.cashAmount),
    card: numeric(row.cardAmount),
    iban: numeric(row.ibanAmount),
    payments,
    expense: numeric(row.expenseAmount),
    note: row.note || '',
    createdBy: row.createdByName || 'Sistem',
    createdAt: row.createdAt?.toISOString?.() || String(row.createdAt || ''),
  };
}

export function mapCariLog(row: any) {
  return {
    id: row.id,
    at: row.createdAt?.toISOString?.() || String(row.createdAt || ''),
    user: row.userName,
    action: row.action,
    detail: row.detail || '',
  };
}

export function mapCariServiceType(row: any, usedCount = 0) {
  return {
    id: row.id,
    name: row.name,
    usedCount,
    createdBy: row.createdByName || 'Sistem',
    createdAt: row.createdAt?.toISOString?.() || String(row.createdAt || ''),
  };
}

export function mapCariPaymentType(row: any, usedCount = 0) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    sortOrder: row.sortOrder,
    usedCount,
    createdBy: row.createdByName || 'Sistem',
    createdAt: row.createdAt?.toISOString?.() || String(row.createdAt || ''),
  };
}

export async function writeCariLog(
  session: CariSession | null,
  action: string,
  detail: string,
  request?: NextRequest
) {
  try {
    const isFallbackId = session?.id?.startsWith('fallback-');
    await prisma.cariLog.create({
      data: {
        userId: session && !isFallbackId ? session.id : null,
        userName: session?.name || 'Sistem',
        userRole: session?.role || null,
        action,
        detail,
        ipAddress: request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        userAgent: request?.headers.get('user-agent') || null,
      },
    });
  } catch (error) {
    console.error('Cari log write failed', error);
  }
}
