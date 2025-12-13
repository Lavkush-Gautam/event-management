import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { CalendarDays, MapPin, Ticket, XCircle } from "lucide-react";
import UpComing from "../components/UpComing";
import TicketModal from "../components/TicketModal";
import { useEvents } from "../context/EventContext";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTicket, setShowTicket] = useState(false);
  const { ticketData, getTicket } = useEvents();

  useEffect(() => {
    loadRegistrations();
  }, []);


  const openTicket = async (eventId) => {
    await getTicket(eventId);
    setShowTicket(true);
  };


  const loadRegistrations = async () => {
    try {
      const res = await axios.get("/api/registration/my");
      setRegistrations(res.data.registrations);
    } catch (err) {
      console.error("Error loading registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="p-10 text-xl text-gray-600">Loading your tickets...</p>;

  // ---------- STATS ----------
  const safeRegistrations = Array.isArray(registrations) ? registrations : [];

  const total = safeRegistrations.length;
  const free = safeRegistrations.filter((r) => r.eventId?.price === 0).length;
  const paid = total - free;

  // ---------- PIE CHART ----------
  const pieData = {
    labels: ["Free", "Paid"],
    datasets: [
      {
        data: [free, paid],
        backgroundColor: ["#34d399", "#f87171"], // green, red
      },
    ],
  };

  // ---------- MONTHLY REGISTRATIONS ----------
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyCounts = Array(12).fill(0);

  safeRegistrations.forEach((reg) => {
    const m = new Date(reg.createdAt).getMonth();
    monthlyCounts[m] += 1;
  });

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Registrations",
        data: monthlyCounts,
        backgroundColor: "#f87171",
      },
    ],
  };

  // ---------- CANCEL REGISTRATION ----------
  const cancelRegistration = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      await axios.delete(`/registration/${eventId}`);
      loadRegistrations();
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  return (
    <div className="p-8 mt-20">

      {/* Title */}
      <UpComing
        title="My Registrations"
        subtitle="View and manage your event registrations"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 px-10">

        <div className=" bg-white p-5  border border-gray-200">
          <p className="text-gray-500">Total Registered Events</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className=" bg-white p-5  border border-gray-200">
          <p className="text-gray-500">Free Events</p>
          <p className="text-3xl font-bold text-green-500">{free}</p>
        </div>

        <div className=" bg-white p-5 border  border-gray-200">
          <p className="text-gray-500">Paid Events</p>
          <p className="text-3xl font-bold text-red-500">{paid}</p>
        </div>

      </div>

      {/* Compact Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 items-center px-10 justify-center">

        {/* Pie Chart */}
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Free vs Paid</h2>
          <div className="h-62">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Monthly Registrations</h2>
          <div className="h-62">
            <Bar data={barData} />
          </div>
        </div>

      </div>


      <UpComing
        title="Registered Events"
        subtitle="Manage your event registrations"
      />

      {safeRegistrations.length === 0 ? (
        <p className="text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-12">
          {safeRegistrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-white overflow-hidden border border-gray-200"
            >
              <img
                src={reg.eventId.banner?.url}
                className="h-48 w-full object-cover"
                alt="event"
              />

              <div className="p-5 space-y-3">

                <h3 className="text-xl font-semibold text-gray-800">
                  {reg.eventId.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarDays size={16} />
                  {new Date(reg.eventId.date).toLocaleDateString("en-IN")}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  {reg.eventId.venue}
                </div>

                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${reg.eventId.price === 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {reg.eventId.price === 0 ? "Free" : `₹${reg.eventId.price}`}
                </span>

                <div className="flex gap-3 pt-4">

                  <button
                    onClick={() => openTicket(reg.eventId._id)}
                    className="flex-1 bg-green-400 hover:bg-green-500 text-white py-2 rounded cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Ticket size={16} className="inline-block mr-2" />
                    View Ticket
                  </button>
                  {/* 
                  <button
                    onClick={() => cancelRegistration(reg.eventId._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                  >
                    <XCircle size={16} className="inline-block mr-2" />
                    Cancel
                  </button> */}

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      <TicketModal isOpen={showTicket} onClose={() => setShowTicket(false)} ticketData={ticketData} />

    </div>
  );
};

export default MyRegistrations;
