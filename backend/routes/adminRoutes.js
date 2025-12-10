import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTicketByEventId,
  getAdminStats,
  getAllRegistrations,
  verifyCheckIn
} from "../controller/eventController.js";

const router = express.Router();

// Admin only routes
router.post(
  "/create",
  auth,
  adminOnly,
  upload.single("banner"),   // 🔥 REQUIRED FOR IMAGE + FORM DATA
  createEvent
);

router.put(
  "/update/:eventId",
  auth,
  adminOnly,
  upload.single("banner"),   // optional if you allow updating banner
  updateEvent
);

router.delete(
  "/delete/:eventId",
  auth,
  adminOnly,
  deleteEvent
);

router.get('/get/:eventId',auth,getTicketByEventId);

// Public routes
router.get("/",getEvents);
router.get("/get/:eventId",auth, getEventById);
router.get("/stats", auth,adminOnly, getAdminStats);
router.get("/all", auth, adminOnly, getAllRegistrations);

router.post("/checkin",auth,adminOnly,verifyCheckIn);

 // new route

export default router;
