import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/adminRoutes.js";
import registrationRoutes from "./routes/eventRoutes.js";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "http://localhost:5173",
  "https://collegeevent-fi2q.onrender.com",
  credentials: true,                 // allow cookies
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/payment", paymentRoutes);

// Determine the path to the root project folder (if you want to serve frontend too)
const projectRoot = path.resolve(__dirname, '..');

// Serve frontend build files (optional)
app.use(express.static(path.join(projectRoot, 'frontend', 'dist')));


app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(projectRoot, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);

});
