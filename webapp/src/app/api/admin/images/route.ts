import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const images: any[] = [];
    const stats = {
      totalImages: 0,
      totalSize: 0,
      byCategory: {} as Record<string, number>,
      byType: {} as Record<string, number>
    };

    // Define image directories to scan
    const directories = [
      { path: 'public/uploads', category: 'display' },
      { path: 'public/uploads/scheduled', category: 'scheduled' },
      { path: 'public/uploads/logos', category: 'company' },
      { path: 'public/icons', category: 'icons' }
    ];

    for (const dir of directories) {
      try {
        await scanDirectory(dir.path, dir.category, images, stats);
      } catch (error) {
        // Silently skip directories that don't exist
        console.log(`Directory ${dir.path} not found or empty - skipping`);
      }
    }

    // Sort images by upload date (newest first)
    images.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return NextResponse.json({
      images,
      stats
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

async function scanDirectory(
  dirPath: string, 
  category: string, 
  images: any[], 
  stats: any
) {
  const fullPath = join(process.cwd(), dirPath);
  
  try {
    const entries = await readdir(fullPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await scanDirectory(join(dirPath, entry.name), category, images, stats);
      } else if (entry.isFile()) {
        const filePath = join(fullPath, entry.name);
        const fileStat = await stat(filePath);
        
        // Check if it's an image file
        if (isImageFile(entry.name)) {
          const relativePath = join(dirPath, entry.name).replace(/\\/g, '/');
          const fileExtension = entry.name.split('.').pop()?.toLowerCase();
          const mimeType = getMimeType(fileExtension || '');
          
          // Determine subcategory based on filename patterns
          let subCategory = category;
          if (category === 'display' && entry.name.includes('qr')) {
            subCategory = 'qr';
          } else if (category === 'scheduled' && entry.name.includes('qr')) {
            subCategory = 'qr';
          }
          
          const imageData = {
            id: `${category}-${entry.name}-${fileStat.mtime.getTime()}`,
            name: entry.name,
            path: relativePath.replace('public/', ''), // Remove 'public/' prefix for correct serving
            size: fileStat.size,
            type: mimeType,
            category: subCategory,
            uploadDate: fileStat.mtime.toISOString(),
            displayId: extractDisplayId(entry.name, dirPath),
            scheduledDisplayId: extractScheduledDisplayId(entry.name, dirPath)
          };
          
          images.push(imageData);
          
          // Update stats
          stats.totalImages++;
          stats.totalSize += fileStat.size;
          stats.byCategory[subCategory] = (stats.byCategory[subCategory] || 0) + 1;
          stats.byType[mimeType] = (stats.byType[mimeType] || 0) + 1;
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read - this is expected for some directories
    if (error.code === 'ENOENT') {
      // Directory doesn't exist, which is fine
      return;
    }
    console.log(`Could not read directory ${dirPath}:`, error);
  }
}

function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp'
  };
  return mimeTypes[extension] || 'image/unknown';
}

function extractDisplayId(filename: string, dirPath: string): number | undefined {
  // Extract display ID from directory structure like "uploads/1/filename"
  const pathParts = dirPath.split('/');
  const displayDir = pathParts.find(part => /^\d+$/.test(part));
  return displayDir ? parseInt(displayDir) : undefined;
}

function extractScheduledDisplayId(filename: string, dirPath: string): number | undefined {
  // Extract scheduled display ID from directory structure like "uploads/scheduled/123/filename"
  if (dirPath.includes('scheduled')) {
    const pathParts = dirPath.split('/');
    const scheduledDir = pathParts.find(part => /^\d+$/.test(part));
    return scheduledDir ? parseInt(scheduledDir) : undefined;
  }
  return undefined;
}
