"use client"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Home() {
  const [userId, setUserId] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data.userId);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (userId) {
        router.push("/pages/geolocation");
      } else {
        router.push("/pages/signup");
      }
    }
  }, [userId, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Replace this with a more sophisticated loading indicator if needed
  }

  return null; // or any other appropriate UI
}

export default Home;
