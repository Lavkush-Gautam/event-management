import React from "react";
import MostVisited from "./MostVisited";

const data = [
  {
    name: "Rock Music Festival",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    location: "Mumbai, India",
  },
  {
    name: "Tech Expo 2025",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
    location: "Delhi NCR",
  },
  {
    name: "Food Carnival",
    image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
    location: "Pune",
  },
];

const Visited = () => {
  return (
    <div className="md:mt-120 pb-20">
      <MostVisited
        events={data}
      />
    </div>
  );
};

export default Visited;
