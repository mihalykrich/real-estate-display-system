import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    
    // Validate icon type
    const validTypes = ['bedroom', 'bathroom', 'livingroom', 'garage'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid icon type' }, { status: 400 });
    }

    const iconDir = join(process.cwd(), 'public', 'icons', type);
    
    try {
      const files = await readdir(iconDir);
      
      // Filter for image files
      const imageExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.webp'];
      const iconFiles = files
        .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
        .map(file => ({
          name: file,
          path: `/icons/${type}/${file}`,
          type: file.split('.').pop()?.toLowerCase() || 'unknown'
        }))
        .sort((a, b) => {
          // Sort by size preference (50x50 first, then 100x100, then others)
          const aSize = a.name.includes('50') ? 0 : a.name.includes('100') ? 1 : 2;
          const bSize = b.name.includes('50') ? 0 : b.name.includes('100') ? 1 : 2;
          return aSize - bSize;
        });

      return NextResponse.json({ 
        icons: iconFiles,
        count: iconFiles.length
      });

    } catch (error) {
      // Directory doesn't exist or can't be read
      return NextResponse.json({ 
        icons: [],
        count: 0
      });
    }

  } catch (error) {
    console.error('Error scanning icons:', error);
    return NextResponse.json({ error: 'Failed to scan icons' }, { status: 500 });
  }
}
