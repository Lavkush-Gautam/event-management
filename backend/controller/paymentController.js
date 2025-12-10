import { razorpay } from "../utils/razorPay.js";
import crypto from "crypto";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Payment from "../models/Payment.js";
import { generateQr } from "../utils/generateQr.js";
import { sendRegistrationEmail } from "../utils/email.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.price === 0)
      return res.status(400).json({ message: "This event is free" });

    const exists = await Registration.findOne({ userId, eventId });
    if (exists)
      return res.status(400).json({ message: "Already registered" });

    const count = await Registration.countDocuments({ eventId });
    if (count >= event.capacity)
      return res.status(400).json({ message: "Event is full" });

    const order = await razorpay.orders.create({
      amount: event.price * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,   // ✅ FIXED: Always under 40 chars
    });

    await Payment.create({
      userId,
      eventId,
      orderId: order.id,
      amount: order.amount,
      status: "PENDING"
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: err.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    const userId = req.user.id;

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ message: "Payment order missing" });

    if (payment.status === "SUCCESS")
      return res.json({ success: true, message: "Already verified" });

    // Update payment
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "SUCCESS";
    await payment.save();

    // Generate QR
    const qrCode = await generateQr({
      userId,
      eventId,
      paymentId: razorpay_payment_id,
      time: Date.now()
    });

    // Prevent double registration
    let registration = await Registration.findOne({ userId, eventId });

    if (!registration) {
      registration = await Registration.create({
        userId,
        eventId,
        qrCode,
        paymentId: razorpay_payment_id
      });

      await Event.findByIdAndUpdate(eventId, { $inc: { totalRegistrations: 1 } });
    }

    const event = await Event.findById(eventId);
    const user = req.user;

    await sendRegistrationEmail(user.email, user.name, event, qrCode);

    res.json({
      success: true,
      message: "Payment verified & registration complete",
      registration
    });

  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("eventId", "title date price")
      .sort({ createdAt: -1 });  // newest first

    res.json({
      success: true,
      totalPayments: payments.length,
      payments,
    });

  } catch (err) {
    console.error("GetAllPayments error:", err);
    res.status(500).json({ error: err.message });
  }
};


