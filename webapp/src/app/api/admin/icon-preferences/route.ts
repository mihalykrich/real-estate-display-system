import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const PREFERENCES_FILE = join(process.cwd(), 'data', 'icon-preferences.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  try {
    await readFile(dataDir);
  } catch {
    const { mkdir } = await import('fs/promises');
    await mkdir(dataDir, { recursive: true });
  }
}

// Load icon preferences
async function loadPreferences() {
  try {
    await ensureDataDir();
    const data = await readFile(PREFERENCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Return default preferences if file doesn't exist
    return {
      bedroom: '',
      bathroom: '',
      livingroom: '',
      garage: ''
    };
  }
}

// Save icon preferences
async function savePreferences(preferences: Record<string, string>) {
  await ensureDataDir();
  await writeFile(PREFERENCES_FILE, JSON.stringify(preferences, null, 2));
}

export async function GET() {
  try {
    const preferences = await loadPreferences();
    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error loading icon preferences:', error);
    return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json();
    
    // Validate preferences
    const validTypes = ['bedroom', 'bathroom', 'livingroom', 'garage'];
    const validPreferences: Record<string, string> = {};
    
    for (const type of validTypes) {
      if (preferences[type] && typeof preferences[type] === 'string') {
        validPreferences[type] = preferences[type];
      }
    }
    
    await savePreferences(validPreferences);
    
    return NextResponse.json({ 
      success: true, 
      preferences: validPreferences 
    });
  } catch (error) {
    console.error('Error saving icon preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
