import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const displays = await prisma.display.findMany({
      select: {
        id: true,
        address: true,
        location: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(displays);
  } catch (error) {
    console.error('Error fetching displays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch displays' },
      { status: 500 }
    );
  }
}
