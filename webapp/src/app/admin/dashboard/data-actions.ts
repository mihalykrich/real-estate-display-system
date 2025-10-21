"use server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });
  
  if (user?.role !== 'admin') {
    throw new Error('Admin access required');
  }
}

export async function exportDataAction() {
  await checkAdminSession();
  
  const displays = await prisma.display.findMany({
    orderBy: { id: 'asc' }
  });
  
  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    displays: displays
  };
}

export async function importDataAction(data: any) {
  await checkAdminSession();
  
  if (!data.displays || !Array.isArray(data.displays)) {
    throw new Error('Invalid data format');
  }
  
  // Clear existing displays
  await prisma.display.deleteMany({});
  
  // Import new displays
  for (const display of data.displays) {
    await prisma.display.create({
      data: {
        address: display.address,
        location: display.location,
        price: display.price,
        priceType: display.priceType,
        bedrooms: display.bedrooms,
        bathrooms: display.bathrooms,
        garage: display.garage,
        propertyType: display.propertyType,
        description: display.description,
        features: display.features,
        mainImage: display.mainImage,
        image1: display.image1,
        image2: display.image2,
        image3: display.image3,
        qrCodePath: display.qrCodePath,
        contactNumber: display.contactNumber,
        email: display.email,
        sidebarColor: display.sidebarColor,
        carouselEnabled: display.carouselEnabled,
        carouselDuration: display.carouselDuration,
        carouselTransition: display.carouselTransition,
      }
    });
  }
  
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin');
}