import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scheduledDisplays = await prisma.scheduledDisplay.findMany({
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(scheduledDisplays);
  } catch (error) {
    console.error('Error fetching scheduled displays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled displays' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      targetDisplayId,
      startDate,
      endDate,
      scheduleType,
      scheduleTime,
      scheduleDays,
      scheduleDate,
      contentData,
    } = body;

    // Validate required fields
    if (!name || !targetDisplayId || !startDate || !contentData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate next execution time
    let nextExecution: Date | null = null;
    const startDateTime = new Date(startDate);
    
    if (scheduleType === 'once') {
      nextExecution = startDateTime;
    } else if (scheduleType === 'daily' && scheduleTime) {
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      nextExecution = new Date(startDateTime);
      nextExecution.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (nextExecution <= new Date()) {
        nextExecution.setDate(nextExecution.getDate() + 1);
      }
    } else if (scheduleType === 'weekly' && scheduleDays && scheduleTime) {
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      const days = scheduleDays.split(',').map(Number);
      const today = new Date().getDay();
      
      // Find the next scheduled day
      const nextDay = days.find(day => day > today) || days[0];
      const daysUntilNext = nextDay > today ? nextDay - today : (7 - today) + nextDay;
      
      nextExecution = new Date();
      nextExecution.setDate(nextExecution.getDate() + daysUntilNext);
      nextExecution.setHours(hours, minutes, 0, 0);
    } else if (scheduleType === 'monthly' && scheduleDate && scheduleTime) {
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      nextExecution = new Date();
      nextExecution.setDate(scheduleDate);
      nextExecution.setHours(hours, minutes, 0, 0);
      
      // If the date has passed this month, schedule for next month
      if (nextExecution <= new Date()) {
        nextExecution.setMonth(nextExecution.getMonth() + 1);
      }
    }

    const scheduledDisplay = await prisma.scheduledDisplay.create({
      data: {
        name,
        description,
        targetDisplayId: parseInt(targetDisplayId),
        startDate: startDateTime,
        endDate: endDate ? new Date(endDate) : null,
        scheduleType,
        scheduleTime,
        scheduleDays,
        scheduleDate: scheduleDate ? parseInt(scheduleDate) : null,
        contentData: JSON.stringify(contentData),
        nextExecution,
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

    return NextResponse.json(scheduledDisplay, { status: 201 });
  } catch (error) {
    console.error('Error creating scheduled display:', error);
    return NextResponse.json(
      { error: 'Failed to create scheduled display' },
      { status: 500 }
    );
  }
}
