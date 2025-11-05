// authExtra.js
// This file adds:
// ✅ Email + Password Signup
// ✅ Email + Password Login
// ✅ Google login with account-link rule
// ✅ JWT Cookie
// ✅ Route protection middleware

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "./User.js";   // CHANGE THIS to your actual user model path

// ------------------- CONFIG -------------------
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ------------------- TOKEN HELPERS -------------------
const signToken = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "7d" }
);

const sendToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// ------------------- AUTH MIDDLEWARE -------------------
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Login required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ------------------- ROUTES -------------------
export default function authRoutes(app) {

  // 📌 REGISTER (Email/PW)
  app.post("/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: "Missing fields" });

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "User exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        passwordHash: hash,
        role: role || "student",
        googleId: null,
        isGoogleLinked: false
      });

      const token = signToken(user);
      sendToken(res, token);
      res.json({ message: "Registered", user });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error" });
    }
  });

  // 📌 LOGIN (Email/PW)
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !user.passwordHash)
        return res.status(400).json({ message: "Invalid email or password" });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ message: "Invalid email or password" });

      const token = signToken(user);
      sendToken(res, token);
      res.json({ message: "Logged in", user });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  // 📌 GOOGLE LOGIN + LINK ACCOUNT RULE
  app.post("/google-login", async (req, res) => {
    try {
      const { idToken } = req.body;

      const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      const { email, sub: googleId, name, picture } = payload;

      let user = await User.findOne({ email });

      // User didn't register first → block
      if (!user) return res.status(403).json({
        message: "Please sign up first using email & password"
      });

      // Link Google if not linked yet
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleLinked = true;
        if (!user.photo) user.photo = picture;
        await user.save();
      }

      const token = signToken(user);
      sendToken(res, token);
      res.json({ message: "Google login success", user });
    } catch (e) {
      console.log(e);
      res.status(401).json({ message: "Google auth failed" });
    }
  });

  // 📌 LOGOUT
  app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  // 📌 TEST PROTECTED ROUTE
  app.get("/me", protect, async (req, res) => {
    res.json({ user: req.user });
  });
}
