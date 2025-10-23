import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageIds } = body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const deletedFiles: string[] = [];
    const errors: string[] = [];

    for (const imageId of imageIds) {
      try {
        // Extract file path from image ID
        // Format: "category-filename-timestamp"
        const parts = imageId.split('-');
        if (parts.length < 3) {
          errors.push(`Invalid image ID format: ${imageId}`);
          continue;
        }

        // Reconstruct the file path
        const category = parts[0];
        const filename = parts.slice(1, -1).join('-'); // Handle filenames with dashes
        const timestamp = parts[parts.length - 1];

        // Determine the directory based on category
        let baseDir = 'public/uploads';
        if (category === 'scheduled') {
          baseDir = 'public/uploads/scheduled';
        } else if (category === 'company') {
          baseDir = 'public/uploads/logos';
        } else if (category === 'icons') {
          baseDir = 'public/icons';
        }

        // Try to find the file in various subdirectories
        const possiblePaths = [
          join(baseDir, filename),
          join(baseDir, '1', filename), // Display ID 1
          join(baseDir, '2', filename), // Display ID 2
          join(baseDir, '3', filename), // Display ID 3
        ];

        // For scheduled images, also check numbered subdirectories
        if (category === 'scheduled') {
          for (let i = 1; i <= 10; i++) {
            possiblePaths.push(join(baseDir, i.toString(), filename));
          }
        }

        let fileDeleted = false;
        for (const filePath of possiblePaths) {
          try {
            await unlink(filePath);
            deletedFiles.push(filePath);
            fileDeleted = true;
            break;
          } catch (error) {
            // File doesn't exist at this path, continue to next
            continue;
          }
        }

        if (!fileDeleted) {
          errors.push(`File not found: ${filename}`);
        }
      } catch (error) {
        errors.push(`Error deleting ${imageId}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      deletedFiles,
      errors,
      message: `Successfully deleted ${deletedFiles.length} file(s)${errors.length > 0 ? `, ${errors.length} error(s)` : ''}`
    });
  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    );
  }
}
