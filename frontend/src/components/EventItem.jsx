import React from "react";

const EventItem = ({ name, date }) => {
  return (
    <div className="min-w-[200px] bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{date}</p>
    </div>
  );
};

export default EventItem;
