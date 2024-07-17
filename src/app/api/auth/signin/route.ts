// app/api/auth/signin/route.ts
import { dbConnect } from '../../../../lib/db';
import User from '../../../models/user.model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('Connecting to the database...');
    const db = await dbConnect();
    console.log('Database connected.');

    const body = await req.json();
    console.log('Request body:', body);
    const { email, password: inputPassword } = body;

    if (!email || !inputPassword) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    console.log('Finding user with email:', email);
    const collection = db.collection('users');
    const validUser = await collection.findOne({ email });
    if (!validUser) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    console.log('User found:', validUser);
    const isPasswordValid = await bcryptjs.compare(inputPassword, validUser.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: 'Wrong credentials' }), { status: 401 });
    }

    console.log('Password is valid.');
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password, ...rest } = validUser;

    return new Response(
      JSON.stringify({ message: 'User logged in successfully', user: rest }),
      {
        status: 200,
        headers: {
          'Set-Cookie': `access_token=${token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; Path=/`,
        },
      }
    );
  } catch (error: any) {
    console.error('Error during user signin:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
