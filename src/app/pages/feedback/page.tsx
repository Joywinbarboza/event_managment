// components/FeedbackForm.js
"use client"
import { useEffect, useState } from 'react';

const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState<any>();
  const [name, setName] = useState<any>();
  const [email, setEmail] = useState<any>();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data.userId);
        setName(data.username);
        setEmail(data.email);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserId();
  }, []);

  // console.log(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, name, email, message }),
    });

    if (res.ok) {
      setStatus('Feedback sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } else {
      setStatus('Failed to send feedback.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md text-black">
      <h1 className="text-2xl font-bold mb-6">Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default FeedbackForm;
