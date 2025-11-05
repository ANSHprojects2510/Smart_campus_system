import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // path to your User model

dotenv.config();

const PLAIN_PASSWORD = "992698"; // original password

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    const user = await User.findOne({ email: "ansh@gmail.com" });
    if (!user) {
      console.log("User not found");
      process.exit(0);
    }

    // Hash password correctly
    const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, 10);

    // Update user in DB
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password updated for ${user.email}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
