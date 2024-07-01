// app/api/auth/signup/route.ts
import { dbConnect } from '../../../../lib/db';
import User from '../../../models/user.model';
import bcryptjs from 'bcryptjs';

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
    return new Response(JSON.stringify({ message: 'User created successfully', user: newUser }), { status: 201 });
  } catch (error:any) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
