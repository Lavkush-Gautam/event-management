import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/events");
      setEvents(res.data);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const getTicket = async (eventId) => {
    try {
      const res = await axiosInstance.get(`/events/get/${eventId}`);
      setTicket(res.data);
      console.log("Ticket Data:", res.data);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load ticket");
      throw error;
    }
  };


  // Get event by ID
  const getEventById = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Event not found");
    } finally {
      setLoading(false);
    }
  };

  // Create event
  const createEvent = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/events/create", data);
      setEvents([res.data.event, ...events]);
      toast.success("Event created successfully!");
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async (eventId, updatedData) => {
  try {
    setLoading(true);

    const res = await axiosInstance.put(
      `/events/update/${eventId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    // Update state with new event
    setEvents((prev) =>
      prev.map((ev) => (ev._id === eventId ? res.data.event : ev))
    );

    return { success: true, event: res.data.event };

  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Update failed"
    };

  } finally {
    setLoading(false);
  }
};


  // Delete event
  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/events/${id}`);
      setEvents(events.filter((ev) => ev._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };

   const verifyCheckIn = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/events/${id}`);
      setEvents(events.filter((ev) => ev._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error };
    } finally {
      setLoading(false);
    }
  };




  // Create Razorpay Order
  const createOrder = async (eventId) => {
    try {
      const res = await axiosInstance.post('/payment/create-order', { eventId });

      return {
        success: true,
        key: res.data.key,
        orderId: res.data.orderId,     // <-- very important
        amount: res.data.amount,
        currency: res.data.currency
      };
    } catch (err) {
      return { success: false };
    }
  };


  // Verify Payment & Register User
  const verifyPayment = async (paymentData) => {
    try {
      const res = await axiosInstance.post('/payment/verify', paymentData);
      return res.data;
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };



const fetchStats = async () => {
  try {
    const res = await axiosInstance.get("/events/stats");

    setStats(res.data.stats);
  } catch (err) {
    console.error("Stats Fetch Error:", err);
  }
};


const [registrations, setRegistrations] = useState([]);


const fetchRegistrations = async () => {
  try {
    const res = await axiosInstance.get("/events/all");
    setRegistrations(res.data.registrations); 
    return res.data.registrations;
  } catch (err) {
    console.error("Load registration error:", err);
  } finally {
    setLoading(false);
  }
};





  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        event,
        getTicket,
        ticket,
        createOrder,
        verifyPayment,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        stats,
        fetchStats,
        fetchRegistrations,
        registrations,
        verifyCheckIn
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
