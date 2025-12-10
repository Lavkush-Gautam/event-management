import React from "react";
import UpComing from "./UpComing";

const MostVisited = ({events }) => {
    return (
        <div className="w-full max-w-6xl mx-auto mt-10 p-6">

            {/* Header */}
            <div>
                <UpComing title="Most Visited Events"
                    subtitle="Here are the most popular events people love" />
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="p-5 bg-white transition"
                    >
                        {/* Image */}
                        <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-40 object-cover rounded-lg"
                        />

                        {/* Content */}
                        <h3 className="text-lg font-semibold mt-3">{event.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{event.location}</p>

                        {/* Button */}
                        <button className="px-4 py-2 bg-white rounded-md text-md font-medium hover:bg-red-400 hover:border-none transition border-2 cursor-pointer border-gray-300">
          View Details
        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MostVisited;
