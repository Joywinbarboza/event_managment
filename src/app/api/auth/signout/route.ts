// pages/api/auth/signout.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    if (req.method === 'POST') {
      const response = NextResponse.json({ message: 'User logged out successfully' }, { status: 200 });
      response.headers.delete('Set-Cookie');
      return response;
    } else {
      return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    return NextResponse.json({ message: 'Failed to log out user' }, { status: 500 });
  }
}
