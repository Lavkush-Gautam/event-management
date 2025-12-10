import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      default: "",
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },

    // NEW IMPORTANT FIELDS
    college: { type: String,  trim: true },
    studentId: { type: String, trim: true },
    course: { type: String, default: "" },
    section: { type: String, default: "" },
    city: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },

    department: { type: String, default: "" },
    year: { type: Number, default: null },

    isActive: { type: Boolean, default: true },

    totalRegistrations: { type: Number, default: 0 },

    resetOtp: String,
    resetOtpExpires: Date,

    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email"
    }
  },
  { timestamps: true }
);

// Auto-remove password when sending JSON response
userSchema.set("toJSON", {
  transform: function (_, ret) {
    delete ret.password;
    return ret;
  }
});

// Index for performance
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
