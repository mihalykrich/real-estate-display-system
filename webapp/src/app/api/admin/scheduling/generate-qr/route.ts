import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scheduledDisplayId, url } = body;

    if (!scheduledDisplayId || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate QR code using a simple API (you can replace this with a proper QR library)
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    // Fetch QR code image
    const qrResponse = await fetch(qrCodeApiUrl);
    if (!qrResponse.ok) {
      throw new Error('Failed to generate QR code');
    }

    const qrBuffer = await qrResponse.arrayBuffer();

    // Create directory for scheduled display images
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'scheduled', scheduledDisplayId.toString());
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `qrCode-${timestamp}.png`;
    const filePath = join(uploadDir, fileName);

    // Save QR code image
    await writeFile(filePath, Buffer.from(qrBuffer));

    // Return file information
    return NextResponse.json({
      success: true,
      fileName,
      filePath: `uploads/scheduled/${scheduledDisplayId}/${fileName}`,
      fileSize: qrBuffer.byteLength,
      mimeType: 'image/png',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
