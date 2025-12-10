import React from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useEvents } from "../context/EventContext";

const TicketModal = ({ isOpen, onClose }) => {
  const { ticket } = useEvents();

  const ticketData = ticket;
  if (!isOpen || !ticketData) return null;

  // DOWNLOAD PDF HANDLER
const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4"); // A4 portrait like BookMyShow

  // === HEADER STRIP (BookMyShow Red) ===
  doc.setFillColor(220, 0, 0);
  doc.rect(0, 0, 210, 25, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("E - T I C K E T", 105, 16, { align: "center" });

  // === OUTER CARD ===
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(10, 35, 190, 230, 4, 4);

  // === EVENT TITLE ===
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(ticketData.eventName, 20, 55);

  // === EVENT DETAILS LEFT SIDE ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(70, 70, 70);

  let y = 75;
  const gap = 10;

  doc.text(`Name: ${ticketData.userName}`, 20, y); y += gap;
  doc.text(`Email: ${ticketData.userEmail}`, 20, y); y += gap;
  doc.text(`Venue: ${ticketData.venue}`, 20, y); y += gap;

  doc.text(
    `Date: ${new Date(ticketData.date).toLocaleDateString("en-IN")}`,
    20,
    y
  );
  y += gap;

  if (ticketData.ticketId) {
    doc.text(`Ticket ID: ${ticketData.ticketId}`, 20, y);
  }

  // === QR CODE (RIGHT SIDE LARGE) ===
  doc.setDrawColor(180, 180, 180);
  doc.roundedRect(120, 55, 70, 70, 4, 4);

  doc.addImage(ticketData.qrCode, "PNG", 125, 60, 60, 60);

  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text("Scan at Entry", 155, 135, { align: "center" });

  // === SEPARATOR LINE ===
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 150, 200, 150);

  // === BOOKING DETAILS TITLE ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Booking Details", 20, 165);

  // === BOOKING INFO LEFT ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);

  let bY = 180;
  const bGap = 8;

  doc.text(`Booked For: ${ticketData.userName}`, 20, bY); bY += bGap;
  doc.text(`Email: ${ticketData.userEmail}`, 20, bY); bY += bGap;
  doc.text(`Event: ${ticketData.eventName}`, 20, bY); bY += bGap;

  // === BARCODE (BOTTOM STRIPE) ===
  doc.setDrawColor(0, 0, 0);
  for (let i = 0; i < 120; i += 3) {
    doc.line(40 + i, 225, 40 + i, 250);
  }

  doc.setFontSize(10);
  doc.text("BOOKING VERIFIED", 105, 255, { align: "center" });

  // === FOOTER NOTE ===
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Please carry a valid ID proof along with this ticket. Non-transferable.",
    105,
    270,
    { align: "center" }
  );

  // SAVE
  doc.save(`${ticketData.eventName}-Ticket.pdf`);
};


  return (
   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden">

    {/* TOP GRADIENT HEADER */}
    <div className="w-full h-28 bg-linear-to-r from-red-500 to-red-700 flex items-center justify-center">
      <h2 className="text-2xl font-bold text-white tracking-wide">
        EVENT TICKET
      </h2>

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-full"
      >
        <X size={20} color="white" />
      </button>
    </div>

    {/* CONTENT */}
    <div className="p-6">

      {/* QR CODE */}
      <div className="flex justify-center">
        <img
          src={ticketData.qrCode}
          alt="QR Code"
          className="w-44 h-44 rounded-lg shadow-md border"
        />
      </div>

      {/* EVENT NAME */}
      <p className="text-center text-2xl mt-4 font-bold text-gray-800">
        {ticketData.eventName}
      </p>

      {/* USER INFO */}
      <div className="mt-4 space-y-2 text-center">
        <p className="text-gray-700 text-md">
          <span className="font-semibold">Name:</span> {ticketData.userName}
        </p>

        <p className="text-gray-700 text-md">
          <span className="font-semibold">Email:</span> {ticketData.userEmail}
        </p>

        <p className="text-gray-700 text-md">
          <span className="font-semibold">Venue:</span> {ticketData.venue}
        </p>

        <p className="text-gray-700 text-md">
          <span className="font-semibold">Date:</span>{" "}
          {new Date(ticketData.date).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 transition-all text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
      >
        <Download size={18} /> Download Premium Pass
      </button>
    </div>
  </div>
</div>

  );
};

export default TicketModal;
