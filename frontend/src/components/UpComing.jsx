import React from "react";

const UpComing = ({ title, subtitle }) => {
  return (
    <div className="w-full max-w-6xl mx-auto  p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            {title}
          </h2>

          <p className="text-gray-500 text-xl font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Red underline */}
      <div className="w-10 h-0.5 mt-5 bg-red-600"></div>
    </div>
  );
};

export default UpComing;
