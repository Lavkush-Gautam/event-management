import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true,
      trim: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      default: 0 // 0 = free event
    },

    banner: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },

    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "workshop", "seminar", "other"],
      default: "other"
    },

    // Admin who created event
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // analytics
    totalRegistrations: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming"
    }
  },

  { timestamps: true }
);

// Index for search and optimization
eventSchema.index({ title: "text", description: "text", tags: 1 });

export default mongoose.model("Event", eventSchema);
