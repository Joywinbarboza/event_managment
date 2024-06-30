import React from "react";
import WaveComponent from "../../components/LandingWave";
import { FaFacebook, FaInstagram, FaTwitter, FaShareAlt } from "react-icons/fa";
import Wave from "react-wavify";

const Home: React.FC = () => {
  return (
    <div
      className="mx-auto py-4 bg-cover bg-no-repeat h-screen w-screen overflow-hidden"
      style={{ backgroundImage: "url('/images/landing_page1.png')" }}
    >
      {/*Navbar container*/}
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

      {/*just a line*/}
      <div className="h-0.5 w-full bg-white opacity-30" />

      <div className="flex w-full justify-center px-[10%] font-bebasNeue">
        <span className="px-5 py-2 hover:text-yellow-500 hover:scale-110">
          HOME
        </span>
        <span className="px-5 py-2 hover:text-yellow-500 hover:scale-110">
          COMBINATIONS
        </span>
        <span className="px-5 py-2 hover:text-yellow-500 hover:scale-110">
          LOGIN
        </span>
        <span className="px-5 py-2 hover:text-yellow-500 hover:scale-110">
          CONTACT US
        </span>
      </div>

      {/* <WaveComponent /> */}

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
