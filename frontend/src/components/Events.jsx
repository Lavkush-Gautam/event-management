import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { useEvents } from "../context/EventContext";
import SearchBar from "../components/SearchBar";

const Events = () => {
  const { events, fetchEvents, loading } = useEvents();

  const [filteredEvents, setFilteredEvents] = useState([]);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Sync filtered events when events change OR search resets
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  if (loading)
    return (
      <div className="p-10 text-xl text-gray-600 animate-pulse">
        Loading events...
      </div>
    );

  return (
    <div className="p-4 px-6">

      {/* SEARCH BAR */}
      <SearchBar
        events={events}
        setFilteredEvents={setFilteredEvents}
      />

      {/* EVENT LIST */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-500 text-lg mt-10 text-center">
          No events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              banner={event.banner}
              name={event.title}
              date={event.date}
              location={event.venue}
              price={event.price}
              isRegistered={event.isRegistered}
              category={event.category}
              capacity={event.capacity}
              totalRegistrations={event.totalRegistrations}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Events;
