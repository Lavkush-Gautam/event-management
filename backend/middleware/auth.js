import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.cookies?.token;

  if (!token) {
    console.log("Auth Failed: No Token Found");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FIX: Fetch full user document
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User no longer exists" });
    }

    req.user = user; // full user object
    next();
    
  } catch (err) {
    console.log("Auth Failed: Token Invalid");
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    next();
};
