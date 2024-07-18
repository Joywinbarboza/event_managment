"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebook, FaInstagram, FaTwitter, FaShareAlt } from "react-icons/fa";
import Wave from "react-wavify";
import { useUser } from "./context/UserContext";

const Home: React.FC = () => {
  const router = useRouter();

  // const [userId, setUserId] = useState<any>(null);
  const { userId, setUserId } = useUser();

  useEffect(() => {
    const checkUserStatus = async () => {
      router.refresh();
    };

    checkUserStatus();
  }, [setUserId]);

  const goToSignUp = () => {
    // Navigate to signup page
    router.push("/pages/signup");
  };

  const signOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUserId(null);
        router.push("/");
      } else {
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const goToCollection = () => {
    // Navigate to collection page
    router.push("/pages/seeCollection");
  };

  // router.refresh();

  return (
    <div
      className="mx-auto py-4 bg-cover bg-no-repeat h-screen w-screen overflow-hidden"
      style={{ backgroundImage: "url('/images/landing_page1.png')" }}
    >
      {/* Navbar container */}
      <div className="flex justify-between items-center p-1 mx-4 rounded-lg">
        {/* Left Content with Social Media Icons */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-white hover:text-blue-500 transition-colors duration-300"
          >
            <FaFacebook size={15} />
          </a>
          <a
            href="#"
            className="text-white hover:text-pink-600 transition-colors duration-300"
          >
            <FaInstagram size={15} />
          </a>
          <a
            href="#"
            className="text-white hover:text-blue-400 transition-colors duration-300"
          >
            <FaTwitter size={15} />
          </a>
        </div>

        {/* Right Content with Share Symbol */}
        <div>
          <a
            href="#"
            className="text-white hover:text-purple-600 transition-colors duration-300"
          >
            <FaShareAlt size={15} />
          </a>
        </div>
      </div>

      {/* Project Name*/}
      <div>
        <p className="font-caveat text-center text-3xl pb-5">EventX</p>
      </div>

      {/* just a line */}
      <div className="h-0.5 w-full bg-white opacity-30" />

      <div className="flex w-full justify-center px-[10%] font-bebasNeue">
        {/* Navigation Links */}
        <span
          className="px-5 py-2 hover:text-yellow-500 hover:scale-110 cursor-pointer"
          onClick={goToSignUp}
        >
          HOME
        </span>
        <span
          className="px-5 py-2 hover:text-yellow-500 hover:scale-110 cursor-pointer"
          onClick={goToCollection}
        >
          COMBINATIONS
        </span>
        {userId ? (
          <span
            className="px-5 py-2 hover:text-yellow-500 hover:scale-110 cursor-pointer animate-pulse"
            onClick={signOut}
          >
            LOGOUT
          </span>
        ) : (
          <span
            className="px-5 py-2 hover:text-yellow-500 hover:scale-110 cursor-pointer animate-pulse"
            onClick={goToSignUp}
          >
            LOGIN
          </span>
        )}
        <span className="px-5 py-2 hover:text-yellow-500 hover:scale-110">
          CONTACT US
        </span>
      </div>

      {/* Waves */}
      <Wave
        fill="#f799c2"
        paused={false}
        style={{ display: "flex" }}
        options={{
          height: 90,
          amplitude: 20,
          speed: 0.3,
          points: 3,
        }}
        className="absolute bottom-0 opacity-50"
      />
      <Wave
        fill="#5B94A2"
        paused={false}
        style={{ display: "flex" }}
        options={{
          height: 100,
          amplitude: 20,
          speed: 0.1,
          points: 3,
        }}
        className="absolute bottom-0 opacity-50"
      />
    </div>
  );
};

export default Home;
