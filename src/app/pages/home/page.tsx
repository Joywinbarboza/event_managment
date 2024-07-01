"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  const goToLandingPage = () => {
    // Navigate to signup page
    router.push("/");
  };

  return (
    <>
      <div className="bg-yellow-400 text-black text-center h-20">
        Navbar Here
      </div>
      <div className="bg-blue-600 font-permanentMarker text-3xl">
        This is where we create <span className="text-red-500">slider</span> and{" "}
        <span className="text-red-500">search</span> And add a{" "}
        <span className="text-yellow-500">Navbar Component</span> which is
        common for all except login and landing page
      </div>
      <center>
        <button
          className="h-96 w-960 items-center bg-purple-500 flex"
          onClick={goToLandingPage}
        >
          go to landing page
        </button>
      </center>
    </>
  );
}

export default Home;
