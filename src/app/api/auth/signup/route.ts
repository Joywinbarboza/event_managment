// app/api/auth/signup/route.ts
import { dbConnect } from '../../../../lib/db';
import User from '../../../models/user.model';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request): Promise<Response> {
  try {
    const db = await dbConnect();

    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already in use' }), { status: 400 });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = { username, email, password: hashedPassword };

    await db.collection('users').insertOne(newUser).then(() => {
      console.log('User created:', newUser);
    });

    const collection = db.collection('users');
    const validUser = await collection.findOne({ email });
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const {...rest } = validUser;

    // return new Response(JSON.stringify({ message: 'User created successfully', user: newUser }), { status: 201 });
    
    return new Response(
      JSON.stringify({ message: 'User logged in successfully', user: rest }),
      {
        status: 200,
        headers: {
          'Set-Cookie': `access_token=${token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; Path=/`,
        },
      }
    );
  } catch (error:any) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
