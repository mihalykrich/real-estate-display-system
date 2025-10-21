"use server";
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { revalidatePath } from 'next/cache';

export async function deleteImageAction(id: number, field: 'mainImage' | 'image1' | 'image2' | 'image3' | 'qrCodePath') {
  const record = await prisma.display.findUnique({ where: { id }, select: { [field]: true } as any });
  const fileName = record?.[field] as string | null | undefined;
  await prisma.display.update({ where: { id }, data: { [field]: null } as any });
  if (fileName) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', String(id), fileName);
    try { await fs.unlink(filePath); } catch {}
  }
  revalidatePath(`/admin/display/${id}`);
  revalidatePath(`/display/${id}`);
}

export async function swapImagesAction(id: number, a: 'mainImage' | 'image1' | 'image2' | 'image3' | 'qrCodePath', b: 'mainImage' | 'image1' | 'image2' | 'image3' | 'qrCodePath') {
  const rec = await prisma.display.findUnique({ where: { id } });
  if (!rec) return;
  const tempA = (rec as any)[a] as string | null;
  const tempB = (rec as any)[b] as string | null;
  await prisma.display.update({ where: { id }, data: { [a]: tempB, [b]: tempA } as any });
  revalidatePath(`/admin/display/${id}`);
  revalidatePath(`/display/${id}`);
}

export async function generateQrAction(id: number, url: string) {
  const dir = path.join(process.cwd(), 'public', 'uploads', String(id));
  await fs.mkdir(dir, { recursive: true });
  const fileName = `qr-${Date.now()}.png`;
  const filePath = path.join(dir, fileName);
  const png = await QRCode.toBuffer(url, { width: 512, margin: 1 });
  await fs.writeFile(filePath, png);
  await prisma.display.update({ where: { id }, data: { qrCodePath: fileName } });
  revalidatePath(`/admin/display/${id}`);
  revalidatePath(`/display/${id}`);
}


