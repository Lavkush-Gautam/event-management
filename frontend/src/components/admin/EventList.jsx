import React, { useEffect, useState } from "react";
import { useEvents } from "../../context/EventContext";
import SearchBar from "../SearchBar";
import EditEventModal from "./EditEventModal";

const EventList = () => {
  const { events, fetchEvents, loading } = useEvents();

  const [filteredEvents, setFilteredEvents] = useState([]);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  // Sync filtered events
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  if (loading)
    return <div className="p-10 text-xl text-gray-600 animate-pulse">Loading events...</div>;

  // Open Modal Function
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  return (
    <div className="p-4 px-6">

      <h1 className="text-gray-800 text-2xl font-semibold">Event Management</h1>


      {/* SEARCH BAR */}
      <SearchBar events={events} setFilteredEvents={setFilteredEvents} />

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left text-sm font-semibold">Banner</th>
              <th className="p-3 border text-left text-sm font-semibold">Name</th>
              <th className="p-3 border text-left text-sm font-semibold">Date</th>
              <th className="p-3 border text-left text-sm font-semibold">Location</th>
              <th className="p-3 border text-left text-sm font-semibold">Price</th>
              <th className="p-3 border text-left text-sm font-semibold">Category</th>
              <th className="p-3 border text-left text-sm font-semibold">Capacity</th>
              <th className="p-3 border text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">

                  {/* Banner */}
                  <td className="border p-2">
                    <img
                      src={event.banner.url}
                      alt="Banner"
                      className="h-12 w-20 object-cover rounded-md"
                    />
                  </td>

                  {/* Name */}
                  <td className="border p-3 text-sm font-medium">{event.title}</td>

                  {/* Date */}
                  <td className="border p-3 text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </td>

                  {/* Location */}
                  <td classname="border p-3 text-sm">{event.venue}</td>

                  {/* Price */}
                  <td className="border p-3 text-sm">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </td>

                  {/* Category */}
                  <td className="border p-3 text-sm">{event.category}</td>

                  {/* Capacity */}
                  <td className="border p-3 text-sm">
                    {event.totalRegistrations}/{event.capacity}
                  </td>

                  {/* Actions */}
                  <td className="border p-3 text-sm space-x-2">
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleEditClick(event)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditEventModal
        open={openModal}
        setOpen={setOpenModal}
        eventData={selectedEvent}
      />

    </div>
  );
};

export default EventList;
