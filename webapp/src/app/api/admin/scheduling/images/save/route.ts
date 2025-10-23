import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      scheduledDisplayId,
      imageType,
      fileName,
      filePath,
      fileSize,
      mimeType,
    } = body;

    // Validate required fields
    if (!scheduledDisplayId || !imageType || !fileName || !filePath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if image already exists for this scheduled display and type
    const existingImage = await prisma.scheduledImage.findFirst({
      where: {
        scheduledDisplayId: parseInt(scheduledDisplayId),
        imageType,
      },
    });

    let scheduledImage;
    if (existingImage) {
      // Update existing image
      scheduledImage = await prisma.scheduledImage.update({
        where: { id: existingImage.id },
        data: {
          fileName,
          filePath,
          fileSize: fileSize || null,
          mimeType: mimeType || null,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new image record
      scheduledImage = await prisma.scheduledImage.create({
        data: {
          scheduledDisplayId: parseInt(scheduledDisplayId),
          imageType,
          fileName,
          filePath,
          fileSize: fileSize || null,
          mimeType: mimeType || null,
        },
      });
    }

    return NextResponse.json(scheduledImage, { status: 201 });
  } catch (error) {
    console.error('Error saving scheduled image:', error);
    return NextResponse.json(
      { error: 'Failed to save scheduled image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scheduledDisplayId = searchParams.get('scheduledDisplayId');
    const imageType = searchParams.get('imageType');

    if (!scheduledDisplayId || !imageType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Find and delete the image record
    const image = await prisma.scheduledImage.findFirst({
      where: {
        scheduledDisplayId: parseInt(scheduledDisplayId),
        imageType,
      },
    });

    if (image) {
      await prisma.scheduledImage.delete({
        where: { id: image.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting scheduled image:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled image' },
      { status: 500 }
    );
  }
}
