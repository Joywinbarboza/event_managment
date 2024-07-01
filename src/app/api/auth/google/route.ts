// pages/api/auth/google.ts
import { dbConnect } from '../../../../lib/db';
import User from '../../../models/user.model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('Connecting to the database...');
    const db = await dbConnect();
    console.log('Database connected.');

    const { email, name, photo } = await req.json();
    console.log('Request body:', { email, name, photo });

    if (!email || !name || !photo) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log('Finding user with email:', email);
    const collection = db.collection('users');
    let user:any = await collection.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 10);

      const newUser = new User({
        username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
        email,
        password: hashedPassword,
        profilePicture: photo,
      });

      user = await collection.insertOne(newUser); // Insert new user document into the "users" collection
    }

    console.log('User found/created:', user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password, ...rest } = user;

    const response = NextResponse.json({ message: 'User logged in successfully', user: rest }, { status: 200 });
    response.headers.set('Set-Cookie', `access_token=${token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; Path=/`);
    return response;
  } catch (error: any) {
    console.error('Error during user signin:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
