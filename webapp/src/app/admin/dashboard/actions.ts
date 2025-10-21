"use server";
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

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
  
  return session.user.id;
}

export async function createUserAction(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  await checkAdminSession();
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash the password
  const passwordHash = await bcrypt.hash(userData.password, 12);
  
  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      passwordHash: passwordHash,
      role: userData.role,
    }
  });
  
  revalidatePath('/admin/dashboard');
  
  // Return the user data with the original password for export
  return {
    user: newUser,
    originalPassword: userData.password
  };
}

export async function getUserLoginDetailsAction(userId: string) {
  await checkAdminSession();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

export async function promoteUserAction(userId: string) {
  await checkAdminSession();
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'admin' },
  });
  
  revalidatePath('/admin/dashboard');
}

export async function demoteUserAction(userId: string) {
  const currentAdminId = await checkAdminSession();
  
  // Prevent self-demotion
  const currentUser = await prisma.user.findUnique({
    where: { email: (await getServerSession(authOptions))?.user?.email },
    select: { id: true }
  });
  
  if (currentUser?.id === userId) {
    throw new Error('Cannot demote yourself');
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'user' },
  });
  
  revalidatePath('/admin/dashboard');
}

export async function deleteUserAction(userId: string) {
  const currentAdminId = await checkAdminSession();
  
  // Prevent self-deletion
  const currentUser = await prisma.user.findUnique({
    where: { email: (await getServerSession(authOptions))?.user?.email },
    select: { id: true }
  });
  
  if (currentUser?.id === userId) {
    throw new Error('Cannot delete yourself');
  }
  
  await prisma.user.delete({
    where: { id: userId },
  });
  
  revalidatePath('/admin/dashboard');
}