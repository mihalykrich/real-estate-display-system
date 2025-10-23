import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate icon type
    const validTypes = ['bedroom', 'bathroom', 'livingroom', 'garage'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid icon type' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}.${fileExtension}`;
    const path = join(process.cwd(), 'public', 'icons', type, fileName);

    // Write file
    await writeFile(path, buffer);

    return NextResponse.json({ 
      success: true, 
      message: 'Icon uploaded successfully',
      path: `/icons/${type}/${fileName}`
    });

  } catch (error) {
    console.error('Error uploading icon:', error);
    return NextResponse.json({ error: 'Failed to upload icon' }, { status: 500 });
  }
}
