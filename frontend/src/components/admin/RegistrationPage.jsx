import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEvents } from "../../context/EventContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  const { registrations, fetchRegistrations } = useEvents();
  const { cancelRegistration } = useAuth();

  useEffect(() => {
    fetchRegistrations().finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-xl">Loading registrations...</p>;

  // SEARCH + FILTER
  const filteredData = registrations.filter((item) => {
    const matchSearch =
      item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.eventId?.title?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "ALL" ||
      (filter === "CHECKED" && item.checkIn) ||
      (filter === "UNCHECKED" && !item.checkIn);

    return matchSearch && matchFilter;
  });

  // SUMMARY NUMBERS
  const checkedInCount = registrations.filter((r) => r.checkIn).length;
  const notCheckedInCount = registrations.length - checkedInCount;

  // CHART CONFIG
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
    animation: { duration: 900, easing: "easeOutBounce" },
  };

  const chartData = {
    labels: ["Checked-In", "Not Checked-In"],
    datasets: [
      {
        label: "Participants",
        data: [checkedInCount, notCheckedInCount],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Registrations Management</h1>

<button
  onClick={() => navigate("/admin/scanner")}
  className="
    flex items-center gap-2
    px-5 py-2.5 
    bg-green-400 text-white 
    border border-green-500
    hover:bg-green-500
    transition-all duration-200
  "
>
  {/* QR Scan Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </svg>

  <span className="font-medium">Scan QR</span>
</button>


</div>


      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user or event..."
          className="p-3 border rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Registrations</option>
          <option value="CHECKED">Checked-In</option>
          <option value="UNCHECKED">Not Checked-In</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Event</th>
              <th className="p-4 font-medium">QR Code</th>
              <th className="p-4 font-medium">Check-In</th>
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{r.userId?.name}</td>
                <td className="p-4">{r.eventId?.title}</td>

                <td className="p-2">
                  <img
                    src={r.qrCode}
                    className="w-12 h-12 rounded shadow"
                    alt="qr"
                  />
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-md text-white text-sm ${
                      r.checkIn ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {r.checkIn ? "Checked-In" : "Pending"}
                  </span>
                </td>

                <td className="p-4">{r.checkInTime || "—"}</td>

                <td className="p-4 flex gap-4">
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => setSelectedItem(r)}
                  >
                    View
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => cancelRegistration(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CHART */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Check-In Summary
        </h2>

        <Bar data={chartData} options={chartOptions} />

        <div className="flex justify-between mt-6 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Checked-In: <b>{checkedInCount}</b>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Not Checked-In: <b>{notCheckedInCount}</b>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
            <h2 className="text-xl font-bold mb-4">Registration Details</h2>

            <p><b>User:</b> {selectedItem.userId?.name}</p>
            <p><b>Event:</b> {selectedItem.eventId?.title}</p>
            <p><b>Status:</b> {selectedItem.checkIn ? "Checked-In" : "Pending"}</p>
            <p><b>Time:</b> {selectedItem.checkInTime || "Not Checked-In Yet"}</p>

            <div className="mt-3">
              <b>QR Code:</b>
              <img
                src={selectedItem.qrCode}
                alt="QR Preview"
                className="mt-2 w-32 h-32 rounded shadow"
              />
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Download Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;
