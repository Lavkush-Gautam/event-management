import express from "express";
import { adminOnly, auth } from "../middleware/auth.js";
import { createOrder, getAllPayments, verifyPayment } from "../controller/paymentController.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

router.get('/all',auth,adminOnly,getAllPayments);

export default router;
