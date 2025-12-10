import React, { useState } from "react";
import { Search, MapPin, Tag } from "lucide-react";

const SearchBar = ({ events, setFilteredEvents }) => {
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    location: "",
  });

  // Handle input change
  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // LIVE FILTERING
    filterEvents(updated);
  };

  // Apply filtering logic
  const filterEvents = (filters) => {
    let filtered = events;

    if (filters.name.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.location.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.venue?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  // Manual search button
  const handleSearchClick = () => {
    filterEvents(filters);
  };

  return (
    <div className="mb-10 flex justify-center w-full">
      <div className="mt-10 w-full md:w-3/4 lg:w-3/4 bg-white/20 backdrop-blur-lg p-2 shadow-lg border border-white/30">

        <div className="flex w-full">

          {/* Event Name */}
          <div className="flex items-center bg-white px-3 h-12 border-r border-gray-300 rounded-l-lg w-full">
            <Search className="text-gray-600 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full outline-none text-gray-800"
              value={filters.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex items-center bg-white px-3 h-12 border-r border-gray-300 w-full">
            <Tag className="text-gray-600 mr-2" size={20} />
            <input
              type="text"
              placeholder="Category"
              className="w-full outline-none text-gray-800"
              value={filters.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="flex items-center bg-white px-3 h-12 border-r border-gray-300 w-full">
            <MapPin className="text-gray-600 mr-2" size={20} />
            <input
              type="text"
              placeholder="Location"
              className="w-full outline-none text-gray-800"
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="bg-red-400 text-white px-6 h-12 flex items-center justify-center
              rounded-r-lg hover:bg-red-500 transition w-40"
          >
            Search
          </button>

        </div>
      </div>
    </div>
  );
};

export default SearchBar;
