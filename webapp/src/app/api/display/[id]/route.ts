import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid display ID' }, { status: 400 });
    }

    const display = await prisma.display.findUnique({
      where: { id }
    });

    if (!display) {
      return NextResponse.json({ error: 'Display not found' }, { status: 404 });
    }

    return NextResponse.json(display);
  } catch (error) {
    console.error('Error fetching display:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
