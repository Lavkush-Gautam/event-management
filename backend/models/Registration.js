import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // If event is paid → paymentId will be saved
    paymentId: {
      type: String,
      default: null,
    },

    // QR Image / Data URL
    qrCode: {
      type: String,
      required: true,
    },

    // Mark if student has entered event
    checkInStatus: {
      type: Boolean,
      default: false,
    },

    checkInTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from registering twice for the same event
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
