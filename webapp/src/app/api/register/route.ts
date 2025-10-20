import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@/generated/prisma';

const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const explicitUrl = process.env.DATABASE_URL || 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public';
    const localPrisma = new PrismaClient({ datasources: { db: { url: explicitUrl } } });
    const existing = await localPrisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    const passwordHash = await bcrypt.hash(data.password, 10);
    await localPrisma.user.create({ data: { name: data.name, email: data.email, passwordHash } });
    await localPrisma.$disconnect();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


