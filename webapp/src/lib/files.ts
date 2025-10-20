import { promises as fs } from 'fs';
import path from 'path';

export async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function saveUploadedFile(dirRelativeToPublic: string, field: string, f: File | null) {
  if (!f || f.size === 0) return null;
  const bytes = await f.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Handle cases where f.name might be undefined or empty
  const fileName = f.name || `${field}.jpg`;
  const safeName = `${field}-${Date.now()}-${fileName}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
  
  const publicDir = path.join(process.cwd(), 'public');
  const dir = path.join(publicDir, dirRelativeToPublic);
  await ensureDir(dir);
  const filePath = path.join(dir, safeName);
  await fs.writeFile(filePath, buffer);
  return safeName;
}


