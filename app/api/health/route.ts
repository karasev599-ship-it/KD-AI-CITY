import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    service: 'KD AI CITY',
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
}
