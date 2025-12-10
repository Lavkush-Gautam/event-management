import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";   // ✅ FIXED

const RegistrationModal = ({
  isOpen,
  onClose,
  onSubmit,
  eventName,
  price,
  eventId
}) => {
  if (!isOpen) return null;

  const { createOrder, verifyPayment, registerForEvent } = useAuth();  // ✅ FIXED
  const [loading, setLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  // ---------------------------
  // PAYMENT HANDLER
  // ---------------------------
  const handlePayment = async () => {
    setLoading(true);

    const orderRes = await createOrder(eventId);

    if (!orderRes || !orderRes.orderId) {
      alert("Failed to create order");
      setLoading(false);
      return;
    }

    const options = {
      key: orderRes.key,
      amount: orderRes.amount,
      currency: orderRes.currency,
      name: "College Events",
      description: `Payment for ${eventName}`,
      order_id: orderRes.orderId,

      handler: async function (response) {
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          eventId
        });

        if (verifyRes.success) {
          setHasPaid(true);
          alert("Payment Verified! You can now register.");
        } else {
          alert("Payment verification failed");
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  // ---------------------------
  // FINAL REGISTER SUBMIT
  // ---------------------------
  const handleFinalSubmit = async () => {
    await registerForEvent(eventId);  // ✅ Calls backend
    onClose();                       // Optional: close modal after register
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg relative">

        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Register for {eventName}
        </h2>

        <div className="flex justify-center gap-4">

          {/* FREE EVENT → ONLY REGISTER */}
          {price === 0 && (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Register
            </button>
          )}

          {/* PAID EVENT → SHOW PAY FIRST */}
          {price > 0 && !hasPaid && (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="px-6 py-2 bg-red-400 border border-gray-400 text-white rounded disabled:bg-blue-300"
            >
              {loading ? "Processing..." : `Pay ₹${price}`}
            </button>
          )}

          {/* AFTER PAYMENT → REGISTER */}
          {price > 0 && hasPaid && (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded"
            >
              Register
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
