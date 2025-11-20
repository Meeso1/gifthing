import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'user-profile.txt');
    const userProfile = await fs.readFile(filePath, 'utf-8');
    
    return NextResponse.json({ profile: userProfile });
  } catch (error) {
    console.error('Error reading user profile:', error);
    return NextResponse.json(
      { error: 'Error loading user profile' },
      { status: 500 }
    );
  }
}

