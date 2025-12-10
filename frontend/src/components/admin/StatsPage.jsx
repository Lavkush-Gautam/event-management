import React, { useEffect } from "react";
import {
  Users,
  Calendar,
  Ticket,
  Wallet,
  CheckCircle,
  BarChart3,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import UpComing from "../UpComing";
import { useEvents } from "../../context/EventContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const StatsPage = () => {
  const { stats, fetchStats } = useEvents();

  useEffect(() => {
    fetchStats();
  }, []);

  // 🎯 Prevent crashes while stats loads
  if (!stats) {
    return <p className="p-6 text-gray-500">Loading statistics...</p>;
  }

  // ---------- PAID VS FREE EVENTS CHART ----------
  const eventChartData = {
    labels: ["Paid Events", "Free Events"],
    datasets: [
      {
        label: "Events",
        data: [
          stats.events?.paid ?? 0,
          stats.events?.free ?? 0
        ],
        backgroundColor: ["#ef4444", "#22c55e"],
      },
    ],
  };
  const monthly = stats?.monthlyGrowth || [];

  const registrationData = {
    labels: monthly.map(m => m.month),
    datasets: [
      {
        label: "Registrations",
        data: monthly.map(m => m.registrations),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.25)",

        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };


  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold mb-6">Stats Management</h1>
    
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        <StatCard
          title="Total Users"
          value={stats.users?.total ?? 0}
          trend="+12%"
          icon={<Users size={20} className="text-orange-500" />}
        />

        <StatCard
          title="Events Organized"
          value={stats.events?.total ?? 0}
          trend="+5%"
          icon={<Calendar size={20} className="text-orange-500" />}
        />

        <StatCard
          title="Total Registrations"
          value={stats.registrations?.total ?? 0}
          trend="+30%"
          icon={<Ticket size={20} className="text-orange-500" />}
        />

        <StatCard
          title="Revenue"
          value={`₹ ${stats.revenue ?? 0}`}
          trend="+42%"
          icon={<Wallet size={20} className="text-orange-500" />}
        />

        <StatCard
          title="Active Users"
          value={stats.users?.active ?? 0}
          trend="-3%"
          icon={<CheckCircle size={20} className="text-orange-500" />}
        />

        <StatCard
          title="Paid Events Ratio"
          value={`${stats.events?.paid ?? 0} / ${stats.events?.total ?? 0}`}
          trend="+9%"
          icon={<BarChart3 size={20} className="text-orange-500" />}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 ">
          <h2 className="text-lg font-semibold mb-4">Paid vs Free Events</h2>
          <Bar data={eventChartData} />
        </div>

        <div className="bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Registrations Over Time</h2>
          <Line data={registrationData} />
        </div>
      </div>
    </div>
  );
};

// CARD COMPONENT
const StatCard = ({ title, value, icon, trend }) => {
  const positive = trend.includes("+");

  return (
    <div className="p-2 bg-white  hover:shadow-lg flex justify-between items-center">
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>

        <div
          className={`flex items-center text-sm mt-1 ${positive ? "text-green-600" : "text-red-500"
            }`}
        >
          {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{trend}</span>
        </div>
      </div>

      <div className="p-2 bg-gray-100 rounded-full shadow">{icon}</div>
    </div>
  );
};

export default StatsPage;
