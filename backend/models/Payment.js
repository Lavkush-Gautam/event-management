import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    orderId: {
      type: String,
      required: true
    },

    paymentId: {
      type: String,
      default: null
    },

    signature: {
      type: String,
      default: null
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },

    // Save QR code only after successful payment
    qrCode: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Index for faster search
paymentSchema.index({ userId: 1, eventId: 1 });

export default mongoose.model("Payment", paymentSchema);
