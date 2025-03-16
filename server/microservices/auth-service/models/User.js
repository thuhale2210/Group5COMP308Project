import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["resident", "business_owner", "community_organizer"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
