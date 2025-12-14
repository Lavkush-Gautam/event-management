import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/adminRoutes.js";
import registrationRoutes from "./routes/eventRoutes.js";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

/* ---------- Path Setup (ESM fix) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- Middlewares ---------- */
app.use(cors({
  origin: "http://localhost:5173", // change to frontend URL in production
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------- API Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/payment", paymentRoutes);

/* ---------- Serve Frontend (Production) ---------- */
const projectRoot = path.resolve(__dirname, "..");

app.use(express.static(path.join(projectRoot, "frontend", "dist")));

// React / Vite fallback
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(projectRoot, "frontend", "dist", "index.html")
  );
});

/* ---------- Server Start ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDb();
  console.log(`✅ Server running on port ${PORT}`);
});
