import React from "react";
import bgImg from "../assets/img1.jpg";
import img from '../assets/img_college.png';

import Categories from "../components/Categories";
import UpComing from "../components/UpComing";
import Events from "../components/Events";
import Working from "../components/Working";
import SearchBar from "../components/SearchBar";
import Visited from "../components/Visited";

const Home = () => {
    return (
        <div className="w-full">

            {/* HERO SECTION */}
            <div
                className="w-full h-screen bg-cover bg-center relative"
                style={{ backgroundImage: `url(${bgImg})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 "></div>

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col h-full justify-center items-center text-white text-center px-4">

                    <h1 className="
      text-5xl md:text-6xl font-extrabold 
      bg-linear-to-r from-blue-400 via-green-400 to-red-400 
      bg-clip-text text-transparent
      drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]
      animate-fadeIn
  ">
                        Connecting You to Campus Events
                    </h1>

                    <p className="mt-4 text-lg md:text-xl font-medium max-w-2xl text-gray-200 animate-slideUp">
                        Explore events, register, and enjoy the best college experiences!
                    </p>

                </div>

            </div>

            {/* CATEGORIES SECTION */}
            <Categories />

            {/* UPCOMING EVENTS */}
            <div className="mt-20 bg-pink-50 py-20">
                <UpComing
                    title="Upcoming Events"
                    subtitle="You can choose to display featured"
                />
                <Events />
            </div>


            {/* WORKING SECTION */}
            <div className="mt-20 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 pb-20">
                <Working />
            </div>

        </div>
    );
};

export default Home;
