import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'Successfully connected to the database!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
  }
}