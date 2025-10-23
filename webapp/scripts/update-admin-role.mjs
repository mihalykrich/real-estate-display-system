import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      const updatedUser = await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: 'admin' }
      });
      
      console.log('Admin user role updated successfully:', {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      console.log('Admin user not found');
    }
  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();
