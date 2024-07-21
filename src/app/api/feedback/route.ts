import { dbConnect } from '../../../lib/db'; // Adjust the path as necessary
import Feedback from '../../models/feedback.model'; // Adjust the path as necessary

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('Connecting to the database...');
    const db = await dbConnect();
    console.log('Database connected.');

    const body = await req.json();
    console.log('Request body:', body);
    const { userId, name, email, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    console.log('Creating new feedback entry...');
    const feedback = new Feedback({
      userId,
      name,
      email,
      message,
    });

    // await feedback.save();
    const collection = db.collection('feedback');
    await collection.insertOne(feedback);
    console.log('Feedback saved successfully.');

    return new Response(
      JSON.stringify({ message: 'Feedback submitted successfully!' }),
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
