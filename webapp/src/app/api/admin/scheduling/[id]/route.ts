import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheduleId = parseInt(id);

    const scheduledDisplay = await prisma.scheduledDisplay.findUnique({
      where: { id: scheduleId },
      include: {
        targetDisplay: {
          select: {
            id: true,
            address: true,
          },
        },
        images: {
          select: {
            id: true,
            imageType: true,
            fileName: true,
            filePath: true,
            fileSize: true,
            mimeType: true,
          },
        },
      },
    });

    if (!scheduledDisplay) {
      return NextResponse.json(
        { error: 'Scheduled display not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scheduledDisplay);
  } catch (error) {
    console.error('Error fetching scheduled display:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled display' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheduleId = parseInt(id);
    const body = await request.json();

    const { isActive, ...updateData } = body;

    const scheduledDisplay = await prisma.scheduledDisplay.update({
      where: { id: scheduleId },
      data: {
        ...updateData,
        isActive: isActive !== undefined ? isActive : undefined,
        updatedAt: new Date(),
      },
      include: {
        targetDisplay: {
          select: {
            id: true,
            address: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json(scheduledDisplay);
  } catch (error) {
    console.error('Error updating scheduled display:', error);
    return NextResponse.json(
      { error: 'Failed to update scheduled display' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheduleId = parseInt(id);

    // Delete associated images first
    await prisma.scheduledImage.deleteMany({
      where: { scheduledDisplayId: scheduleId },
    });

    // Delete the scheduled display
    await prisma.scheduledDisplay.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting scheduled display:', error);
    return NextResponse.json(
      { error: 'Failed to delete scheduled display' },
      { status: 500 }
    );
  }
}
