"use server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  // Get user with password hash
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { 
      id: true, 
      email: true, 
      passwordHash: true 
    }
  });

  if (!user || !user.passwordHash) {
    throw new Error('User not found or no password set');
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  
  if (!isCurrentPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(data.newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash }
  });

  return { success: true };
}
