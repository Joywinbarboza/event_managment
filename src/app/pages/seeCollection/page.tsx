"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios"; // Axios for making HTTP requests
// import { useRouter } from 'next/router';

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [userId, setUserId] = useState<any>();
  const [userName, setUserName] = useState<any>();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data.userId);
        setUserName(data.username);
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
        const fetchedCollections = response.data.collections.map(
          (collection) => ({
            ...collection,
            // Add default values for missing fields if needed
          })
        );
        setCollections(fetchedCollections);
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Collections</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Collections for <span className="text-indigo-600">{userName}</span>
        </h1>

        {Object.keys(groupedCollections).map((batchId) => {
          const collections = groupedCollections[batchId];
          const collectionName = collections[0]?.collectionName;

          return (
            <div
              key={batchId}
              className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <h2 className="text-2xl font-semibold mb-4 px-6 py-4 bg-indigo-600 text-white">
                {collectionName || "Unnamed Collection"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {collections.map((collection) => (
                  <div
                    key={collection._id}
                    className="bg-gray-50 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800">
                        {collection.placeName || "Unnamed Place"}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-semibold">Category:</span>{" "}
                          {collection.category || "Uncategorized"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Keyword:</span>{" "}
                          {collection.keyword || "No keyword"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Created:</span>{" "}
                          {collection.createdAt
                            ? new Date(collection.createdAt).toLocaleString()
                            : "Unknown"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Rating:</span>{" "}
                          {collection.rating || "Not rated"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Phone:</span>{" "}
                          {collection.formatted_phone_number || "Not available"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Address:</span>{" "}
                          {collection.formatted_address || "Not available"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Price Level:</span>{" "}
                          {collection.price_level || "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
