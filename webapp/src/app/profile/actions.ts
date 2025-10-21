"use server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(data: {
  name: string;
  companyName: string;
  phoneNumber: string;
  bio: string;
  website: string;
  timezone: string;
  language: string;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: data.name || null,
      companyName: data.companyName || null,
      phoneNumber: data.phoneNumber || null,
      bio: data.bio || null,
      website: data.website || null,
      timezone: data.timezone || 'Europe/London',
      language: data.language || 'en'
    }
  });

  revalidatePath('/profile');
}

export async function uploadLogoAction(file: File) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, companyLogo: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create uploads/logos directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const fileExtension = path.extname(file.name);
  const fileName = `${user.id}-${Date.now()}${fileExtension}`;
  const filePath = path.join(uploadDir, fileName);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(filePath, buffer);

  // Delete old logo if it exists
  if (user.companyLogo) {
    const oldLogoPath = path.join(uploadDir, user.companyLogo);
    try {
      await fs.unlink(oldLogoPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  // Update user record with new logo path
  await prisma.user.update({
    where: { id: user.id },
    data: { companyLogo: fileName }
  });

  revalidatePath('/profile');
  revalidatePath('/'); // Revalidate home page for navbar logo
}

export async function deleteLogoAction() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, companyLogo: true }
  });

  if (!user || !user.companyLogo) {
    throw new Error('No logo to delete');
  }

  // Delete logo file
  const logoPath = path.join(process.cwd(), 'public', 'uploads', 'logos', user.companyLogo);
  try {
    await fs.unlink(logoPath);
  } catch (error) {
    // Ignore if file doesn't exist
  }

  // Update user record
  await prisma.user.update({
    where: { id: user.id },
    data: { companyLogo: null }
  });

  revalidatePath('/profile');
  revalidatePath('/'); // Revalidate home page for navbar logo
}
