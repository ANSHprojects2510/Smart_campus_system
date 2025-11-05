import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // Make passwordHash optional
  passwordHash: { type: String }, // no 'required: true'

  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  googleId: { type: String, default: null },
  isGoogleLinked: { type: Boolean, default: false }
});

export default mongoose.model("User", UserSchema, "user2");


