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

import { useAuth } from "../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UsersPage = () => {

  const { userList, fetchAllUsers } = useAuth();

  const [users, setUsers] = useState([]);   // DEFAULT EMPTY ARRAY
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);


  // 🔥 Load data from backend
  useEffect(() => {
    const load = async () => {
      await fetchAllUsers();   // fills userList in context
    };
    load();
  }, []);

  // 🔥 When context updates, update UI state
  useEffect(() => {
    if (userList) setUsers(userList);
  }, [userList]);

  const getPaymentStatus = (user) => {
    if (user.paidEvents > 0 && user.freeEvents > 0) return "Mixed";
    if (user.paidEvents > 0) return "Paid";
    return "Free";
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Paid": return "bg-blue-500";
      case "Free": return "bg-green-500";
      case "Mixed": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Prevent crash if users is empty
  if (!users || users.length === 0) {
    return <p className="p-6">Loading users...</p>;
  }

  // FILTERING
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && u.active) ||
      (statusFilter === "INACTIVE" && !u.active);

    const matchesPayment =
      paymentFilter === "ALL" ||
      paymentFilter === getPaymentStatus(u);

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // CHART DATA (Paid vs Free)
  const totalPaid = users.reduce((sum, u) => sum + u.paidEvents, 0);
  const totalFree = users.reduce((sum, u) => sum + u.freeEvents, 0);

  const chartData = {
    labels: ["Paid Events", "Free Events"],
    datasets: [
      {
        label: "Total Across All Users",
        data: [totalPaid, totalFree],
        backgroundColor: ["#3b82f6", "#22c55e"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* FILTER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          placeholder="Search user by name or email..."
          className="p-3 border rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Status Filter */}
        <select
          className="p-3 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Users</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {/* Payment Type Filter */}
        <select
          className="p-3 border rounded-md"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="ALL">All Payment Types</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Events</th>
              <th className="p-4 font-medium">Paid</th>
              <th className="p-4 font-medium">Free</th>
              <th className="p-4 font-medium">Payment Type</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => {
              const status = getPaymentStatus(u);

              return (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 capitalize">{u.role}</td>

                  {/* ACTIVE/INACTIVE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-white rounded-md text-sm ${
                        u.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">{u.eventsRegistered}</td>
                  <td className="p-4">{u.paidEvents}</td>
                  <td className="p-4">{u.freeEvents}</td>

                  {/* PAYMENT TYPE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-white rounded-md text-sm ${badgeColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedUser(u)}
                    >
                      View
                    </button>

                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CHART */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Total Events Summary</h2>
        <Bar data={chartData} />
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
            <h2 className="text-xl font-bold mb-4">User Details</h2>

            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
            <p><b>Status:</b> {selectedUser.active ? "Active" : "Inactive"}</p>
            <p><b>Events Joined:</b> {selectedUser.eventsRegistered}</p>
            <p><b>Paid Events:</b> {selectedUser.paidEvents}</p>
            <p><b>Free Events:</b> {selectedUser.freeEvents}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                Email User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
