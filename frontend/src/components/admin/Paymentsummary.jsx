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
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PaymentsSummary = () => {
  const { payments, fetchPayments } = useAuth();
  console.log("Payments:", payments);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [modalData, setModalData] = useState(null);




const downloadInvoice = () => {
  if (!modalData) return;

  const doc = new jsPDF("p", "mm", "a4");

  // HEADER
  doc.setFillColor(220, 0, 0);
  doc.rect(0, 0, 210, 20, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("PAYMENT INVOICE", 105, 13, { align: "center" });

  // Company / App Name
  doc.setFontSize(10);
  doc.text("Event Management System", 105, 18, { align: "center" });

  // MAIN BOX
  doc.setDrawColor(180, 180, 180);
  doc.roundedRect(10, 30, 190, 230, 4, 4);

  let y = 45;
  const gap = 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text("User Details", 20, y);
  y += gap;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Name: ${modalData.userId?.name}`, 20, y); y += gap;
  doc.text(`Email: ${modalData.userId?.email}`, 20, y); y += gap;

  // EVENT DETAILS
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("Event Details", 20, y);
  y += gap;

  doc.setFont("helvetica", "normal");
  doc.text(`Event: ${modalData.eventId?.title}`, 20, y); y += gap;
  doc.text(`Order ID: ${modalData.orderId}`, 20, y); y += gap;
  doc.text(`Payment ID: ${modalData.paymentId || "N/A"}`, 20, y); y += gap;
  doc.text(`Amount Paid: ₹${modalData.amount}`, 20, y); y += gap;
  doc.text(`Status: ${modalData.status}`, 20, y); y += gap;
  doc.text(
    `Date: ${new Date(modalData.createdAt).toLocaleString("en-IN")}`,
    20,
    y
  );

  // FOOTER LINE
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 260, 200, 260);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("This is a system generated invoice. No signature required.", 105, 268, {
    align: "center",
  });

  doc.save(`Invoice-${modalData.eventId?.title}.pdf`);
};


  // 🔥 Load payments from backend
  useEffect(() => {
    fetchPayments();
  }, []);

  const statusColor = {
    success: "bg-green-500",
    failed: "bg-red-500",
    pending: "bg-yellow-500",
  };

  // FILTER PAYMENTS
  const filteredPayments = payments.filter((p) => {
    return (
      (filter === "ALL" || p.status === filter) &&
      (
        p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.eventId?.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.orderId?.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // CALCULATE SUMMARY
  const totalSuccess = filteredPayments
    .filter((p) => p.status === "success")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPending = filteredPayments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0);

  const totalFailed = filteredPayments
    .filter((p) => p.status === "failed")
    .reduce((acc, p) => acc + p.amount, 0);

  const chartData = {
    labels: ["Success", "Pending", "Failed"],
    datasets: [
      {
        label: "Payment Amount",
        data: [totalSuccess, totalPending, totalFailed],
        backgroundColor: ["#22c55e", "#fbbf24", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payments Summary</h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search user, event, order ID..."
          className="p-3 w-full md:w-1/3 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-md w-full md:w-48"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Payments</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* PAYMENT TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Event</th>
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Payment ID</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{p.userId?.name}</td>
                <td className="p-4">{p.eventId?.title}</td>
                <td className="p-4">{p.orderId}</td>
                <td className="p-4">{p.paymentId || "—"}</td>
                <td className="p-4">₹{p.amount}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-md text-white text-sm ${
                      statusColor[p?.status]
                    }`}
                  >
                    {p?.status.toUpperCase()}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => setModalData(p)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CHART */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Total Payment Summary</h2>
        <Bar data={chartData} />
      </div>

      {/* MODAL */}
      {modalData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>

            <p><b>User:</b> {modalData.userId?.name}</p>
            <p><b>Email:</b> {modalData.userId?.email}</p>
            <p><b>Event:</b> {modalData.eventId?.title}</p>
            <p><b>Order ID:</b> {modalData.orderId}</p>
            <p><b>Payment ID:</b> {modalData.paymentId || "N/A"}</p>
            <p><b>Amount:</b> ₹{modalData.amount}</p>
            <p><b>Status:</b> {modalData.status}</p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-5 py-2 bg-gray-300 rounded"
                onClick={() => setModalData(null)}
              >
                Close
              </button>

              <button onClick={downloadInvoice} className="px-5 py-2 bg-red-500 text-white rounded">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsSummary;
