import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalDisplays = await prisma.display.count();
    const activeDisplays = await prisma.display.count({
      where: {
        OR: [
          { address: { not: null } },
          { location: { not: null } },
          { price: { not: null } },
          { mainImage: { not: null } },
          { image1: { not: null } },
          { image2: { not: null } },
          { image3: { not: null } }
        ]
      }
    });

    return NextResponse.json({
      totalDisplays,
      activeDisplays
    });
  } catch (error) {
    console.error('Error fetching display stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
