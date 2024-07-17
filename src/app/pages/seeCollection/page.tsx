"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios"; // Axios for making HTTP requests
// import { useRouter } from 'next/router';

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [userId, setUserId] = useState<any>();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/collections/read/${userId}`);
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Group collections by batchId
  const groupedCollections = collections.reduce((acc, collection) => {
    const { batchId } = collection;
    if (!acc[batchId]) {
      acc[batchId] = [];
    }
    acc[batchId].push(collection);
    return acc;
  }, {});

  return (
    <div className="bg-gray-100 min-h-screen py-6 text-black">
      <Head>
        <title>Collections</title>
      </Head>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">
          Collections for User ID: {userId}
        </h1>

        {Object.keys(groupedCollections).map((batchId) => (
          <div key={batchId} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Batch ID: {batchId}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedCollections[batchId].map((collection) => (
                <div key={collection._id} className="bg-gray-200 p-4 rounded">
                  <h3 className="text-lg font-bold mb-2">
                    {collection.placeName}
                  </h3>
                  <p className="text-gray-600">
                    Category: {collection.category}
                  </p>
                  <p className="text-gray-600">
                    Keyword: {collection.keyword}
                  </p>
                  <p className="text-gray-600">
                    Created At:{" "}
                    {new Date(collection.createdAt).toLocaleString()}
                  </p>
                  {/* Add more details as needed */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

