import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { generateQr } from "../utils/generateQr.js";
import { sendRegistrationEmail } from "../utils/email.js";

/* ============================================================
   1. REGISTER FOR EVENT (FREE EVENTS ONLY)
============================================================ */
export const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    /* ---------------------------
       1️⃣ Check Event Exists
    ---------------------------- */
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    /* ---------------------------
       2️⃣ Prevent Free Registration for Paid Events
    ---------------------------- */
    if (event.price > 0)
      return res.status(400).json({ message: "This event requires payment" });

    /* ---------------------------
       3️⃣ Prevent Duplicate Registration
    ---------------------------- */
    const exists = await Registration.findOne({ userId, eventId });
    if (exists)
      return res.status(400).json({ message: "Already registered" });

    /* ---------------------------
       4️⃣ Check Event Capacity
    ---------------------------- */
    const regCount = await Registration.countDocuments({ eventId });
    if (regCount >= event.capacity)
      return res.status(400).json({ message: "Event is full" });

    /* ---------------------------
       5️⃣ Generate QR Code
    ---------------------------- */
    const qrCode = await generateQr({
      userId,
      eventId,
      time: Date.now(),
    });

    /* ---------------------------
       6️⃣ Create Registration
    ---------------------------- */
    const registration = await Registration.create({
      userId,
      eventId,
      qrCode,
    });

    /* ---------------------------
       7️⃣ Update Event Registration Count
    ---------------------------- */
    await Event.findByIdAndUpdate(eventId, {
      $inc: { totalRegistrations: 1 },
    });

    /* ---------------------------
       8️⃣ Send Registration Email
    ---------------------------- */
    await sendRegistrationEmail(
      req.user.email,
      req.user.name,
      event,
      qrCode
    );

    /* ---------------------------
       9️⃣ FINAL RESPONSE
    ---------------------------- */
    res.json({
      success: true,
      message: "Registered successfully",
      registration,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ============================================================
   2. GET ALL REGISTRATIONS OF LOGGED-IN USER
============================================================ */
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration.find({ userId })
      .populate("eventId", "title date venue price banner category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (err) {
    console.error("GetMyRegistrations error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const reg = await Registration.findByIdAndDelete(registrationId);

    if (!reg)
      return res.status(404).json({ message: "Registration not found" });

    // decrease event count
    await Event.findByIdAndUpdate(reg.eventId, {
      $inc: { totalRegistrations: -1 }
    });

    res.json({ success: true, message: "Registration deleted" });
  } catch (err) {
    console.error("CancelRegistration error:", err);
    res.status(500).json({ error: err.message });
  }
};





export const createPaidRegistration = async (user, eventId, paymentId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    // Prevent duplicate registration
    const exists = await Registration.findOne({
      userId: user.id,
      eventId,
    });

    if (exists) return exists;

    // Capacity check
    const regCount = await Registration.countDocuments({ eventId });
    if (regCount >= event.capacity)
      throw new Error("Event is full");

    // QR Code
    const qrCode = await generateQr({
      userId: user.id,
      eventId,
      paymentId,
      time: Date.now(),
    });

    // Create registration
    const registration = await Registration.create({
      userId: user.id,
      eventId,
      qrCode,
      paymentId,
    });

    // Update event's total registrations
    await Event.findByIdAndUpdate(eventId, {
      $inc: { totalRegistrations: 1 },
    });

    // Send Email
    await sendRegistrationEmail(user.email, user.name, event, qrCode);

    return registration;
  } catch (err) {
    console.error("Paid Registration Error:", err);
    throw err;
  }
};
