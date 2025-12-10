import express from "express";
import { adminOnly, auth } from "../middleware/auth.js";
import {
  registerEvent,
  getMyRegistrations,
  cancelRegistration
} from "../controller/registrationController.js";

const router = express.Router();

router.post("/:eventId", auth, registerEvent);

// register for free eventa
router.get("/my", auth, getMyRegistrations);
          // my registrations
router.delete("/:registrationId",auth, adminOnly, cancelRegistration); // cancel registration

export default router;
