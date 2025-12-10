import React from "react";

const CategoryCard = ({ icon: Icon, title, count }) => {
  return (
    <div className="category-card bg-white  shadow-md p-10 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 text-gray-900 gap-2 border border-gray-400 rounded-md">
      <Icon size={36} className="text-red-500 mb-2" />

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="text-gray-600 text-sm">{count} Events</p>
    </div>
  );
};

export default CategoryCard;
