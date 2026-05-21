import { NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';

export async function GET(req: Request) {
  return NextResponse.json({ authenticated: isAuthed(req) });
}
