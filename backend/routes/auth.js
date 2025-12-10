import express from "express";
import { register, login, logout, getProfile, updateProfile, getAllUsers, requestPasswordResetOtp, verifyPasswordResetOtp, resetPassword } from "../controller/userController.js";
import { adminOnly, auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/profile", auth, getProfile);
router.put("/update-profile", auth, updateProfile);
router.get("/all-users", auth,adminOnly, getAllUsers);
router.post("/request-reset-otp", requestPasswordResetOtp);
router.post("/verify-reset-otp", verifyPasswordResetOtp);
router.post("/reset-password", resetPassword);


export default router;
