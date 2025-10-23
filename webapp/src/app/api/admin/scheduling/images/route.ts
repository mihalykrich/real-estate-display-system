import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const scheduledDisplayId = formData.get('scheduledDisplayId') as string;
    const imageType = formData.get('imageType') as string;

    if (!file || !scheduledDisplayId || !imageType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate image type
    const validImageTypes = ['mainImage', 'image1', 'image2', 'image3', 'qrCode', 'companyLogo'];
    if (!validImageTypes.includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Create directory for scheduled display images
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'scheduled', scheduledDisplayId);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${imageType}-${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return file information
    return NextResponse.json({
      success: true,
      fileName,
      filePath: `uploads/scheduled/${scheduledDisplayId}/${fileName}`,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Error uploading scheduled image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
