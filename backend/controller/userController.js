import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import Registration from "../models/Registration.js";
import { sendUserWelcomeEmail } from "../utils/welcome.js";
import { sendOtpEmail } from "../utils/otp.js";

export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashed,
      role
    });

    const safeUser = user.toObject();
    delete safeUser.password;

     sendUserWelcomeEmail(email, name).catch((err) =>
      console.error("Email error:", err)
    );

    res.json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie (httpOnly)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // true for HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(0)  // delete cookie
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let {
      name,
      email,
      phone,
      college,
      studentId,
      course,
      section,
      city,
      department,
      year,
      emergencyContact,
      password,
      avatar
    } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    delete req.body.role;

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (college) user.college = college.trim();
    if (studentId) user.studentId = studentId.trim();
    if (course) user.course = course.trim();
    if (section) user.section = section.trim();
    if (city) user.city = city.trim();
    if (department) user.department = department.trim();
    if (year) user.year = year;
    if (emergencyContact) user.emergencyContact = emergencyContact.trim();

    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: userId }
      });
      if (emailExists)
        return res.status(400).json({ message: "Email already taken" });
      user.email = email.toLowerCase().trim();
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ------------- CLOUDINARY BASE64 UPLOAD -------------
   if (avatar) {

  // Case 1: Avatar is an existing object → skip upload
  if (typeof avatar === "object") {
    // Do nothing (keeps old avatar)
  }

  // Case 2: Avatar is a base64 string → upload new image
  else if (typeof avatar === "string" && avatar.startsWith("data:")) {
    
    // Delete old avatar from Cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new base64 image
    const uploaded = await cloudinary.uploader.upload(avatar, {
      folder: "event-system/users",
    });

    user.avatar = {
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    };
  }

  // Case 3: Anything else → ignore safely
  else {
    console.log("Avatar ignored (not base64 or file-object)");
  }
}

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json({
      message: "Profile updated successfully",
      user: safeUser,
    });

  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
   const users = await User.find().select("-password");

    // Fetch all registrations once (better performance)
    const registrations = await Registration.find().populate("eventId");

    // Prepare formatted result
    const result = users.map(user => {
      const userRegs = registrations.filter(r => r.userId.toString() === user._id.toString());

      const paidEvents = userRegs.filter(r => r.eventId?.price > 0).length;
      const freeEvents = userRegs.filter(r => r.eventId?.price === 0).length;

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.isActive,
        eventsRegistered: userRegs.length,
        paidEvents,
        freeEvents,
        createdAt: user.createdAt,
      };
    });
    res.json({ users: result });

  } catch (err) {
    console.error("GetAllUsers error:", err);
    res.status(500).json({ error: err.message });
  }
};



export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes
    await user.save();

    await sendOtpEmail(email, otp);

    return res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const verifyPasswordResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp)
      return res.status(400).json({ error: "Invalid OTP request" });

    // Check expiry
    if (user.resetOtpExpires < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    // Compare OTP
    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid)
      return res.status(400).json({ error: "Incorrect OTP" });

    return res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: error.message });
  }
};

