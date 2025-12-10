import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Ticket
} from "lucide-react";
import axios from "axios";
import RegistrationModal from "./RegistrationModal";
import TicketModal from "./TicketModal";
import { useEvents } from "../context/EventContext";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

const EventCard = ({
  id,
  banner,
  name,
  date,
  location,
  price,
  isRegistered,
  category,
  capacity,
  totalRegistrations
}) => {
  const imageList = Array.isArray(banner) ? banner.filter(Boolean) : [banner];
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const openRegistration = () => {
    if (!isRegistered) setIsOpen(true);
  };

  // SHOW TICKET (fetch QR)
  const { getTicket } = useEvents();
  const loadTicket = async () => {
    await getTicket(id);  // ← loads into context
    setShowTicket(true);
  };


  // CANCEL REGISTRATION
  const cancelRegistration = async () => {
    try {
      await axios.delete(`/registration/${id}`);
      alert("Registration cancelled.");
      window.location.reload();
    } catch (err) {
      alert("Unable to cancel registration.");
    }
  };

  const nextImage = () =>
    setIndex((i) => (i + 1) % imageList.length);

  const prevImage = () =>
    setIndex((i) => (i - 1 + imageList.length) % imageList.length);

  const seatsLeft = capacity - totalRegistrations;

  return (
    <>
      <div className="max-w-sm bg-white rounded-md overflow-hidden relative shadow">

        {/* CATEGORY TAG */}
        {category && (
          <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {category}
          </span>
        )}

        {/* REGISTERED BADGE */}
        {isRegistered && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            Registered
          </span>
        )}

        {/* IMAGE */}
        <div className="relative h-64 bg-gray-200">
          {loading && <div className="absolute inset-0 bg-gray-300 animate-pulse" />}

          <img
            src={banner?.url}
            className="w-full h-full object-cover"
            onLoad={() => setLoading(false)}
          />

          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-3 bg-white/70 p-2 rounded-full shadow"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextImage}
                className="absolute top-1/2 right-3 bg-white/70 p-2 rounded-full shadow"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* DETAILS */}
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-semibold">{name}</h2>

          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={16} />
            <span>
              {new Date(date).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={16} />
            <span>{location}</span>
          </div>

          {/* AVAILABLE SEATS */}
          <p className="text-gray-600 text-sm">
            Seats Left:{" "}
            <span className="font-bold">{seatsLeft <= 0 ? "Full" : seatsLeft}</span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center p-4">
          {!isRegistered ? (
            <button
              className="px-6 py-2 bg-white border-2 border-gray-300 hover:bg-red-400 hover:text-white transition rounded-md"
              onClick={openRegistration}
            >
              Register
            </button>
          ) : (
            <button
              onClick={loadTicket}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md"
            >
              <Ticket size={16} />
              View Pass
            </button>
          )}

          <span className="text-lg font-bold text-red-400">
            {price === 0 ? "Free" : `₹${price}`}
          </span>
        </div>
      </div>

      {/* MODALS */}
      <RegistrationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventName={name}
        price={price}
        eventId={id}
        isRegistered={isRegistered}
      />
      <TicketModal isOpen={showTicket} onClose={() => setShowTicket(false)} ticketData={ticketData} />

    </>
  );
};

export default EventCard;
