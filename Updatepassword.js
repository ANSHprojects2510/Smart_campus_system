import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // Make sure path is correct

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function updatePassword() {
  const email = "ansh@gmail.com";
  const plainPassword = "992698";

  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found");
    return mongoose.disconnect();
  }

  const hashed = await bcrypt.hash(plainPassword, 10);
  user.password = hashed;
  await user.save();

  console.log(`✅ Password updated for ${email}`);
  mongoose.disconnect();
}

updatePassword();
