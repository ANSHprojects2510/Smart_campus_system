import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ------------------ REGISTER ------------------
router.post("/register", async (req, res) => {
  console.log("🟢 /register called", req.body);

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields in registration");
      return res.status(400).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password.trim(), 10);
    console.log("✅ Password hashed");

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      passwordHash: hash, // only for email/password users
      role,
      googleId: null,
      isGoogleLinked: false,
    });

    await user.save();
    console.log("✅ User registered:", email);

    res.json({ message: "Registration successful", user });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ LOGIN (email/password) ------------------
router.post("/login", async (req, res) => {
  console.log("🟢 /login called", req.body);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.passwordHash) {
      console.log("❌ User registered with Google, no password:", email);
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful:", email);
    res.json({
      message: "Login successful",
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ GOOGLE LOGIN ------------------
router.post("/google-login", async (req, res) => {
  console.log("🟢 /google-login called", req.body);

  try {
    const { token, role } = req.body;
    if (!token) {
      console.log("❌ Google token missing");
      return res.status(400).json({ message: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    console.log("✅ Google payload:", payload);

    let user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not registered yet:", email);
      return res.status(403).json({
        message: "Please register first using email & password",
      });
    }

    // Link Google login if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      user.isGoogleLinked = true;
      await user.save();
      console.log("✅ Google account linked for:", email);
    }

    if (user.role !== role) {
      console.log(
        `❌ Role mismatch: expected ${role}, actual ${user.role}`
      );
      return res.status(400).json({
        message: `This Google account is not registered as ${role}`,
      });
    }

    console.log("✅ Google login successful:", email);
    res.json({
      message: "Google login successful",
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;


