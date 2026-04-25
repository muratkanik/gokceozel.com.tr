import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const appointment = await prisma.appointments.create({
      data: {
        name,
        email: email || null,
        phone,
        message: message || null,
        status: 'pending',
      }
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error('Randevu submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
