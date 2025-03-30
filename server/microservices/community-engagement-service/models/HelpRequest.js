import mongoose from "mongoose";

const HelpRequestSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  location: { type: String },
  isResolved: { type: Boolean, default: false },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true }); // 👈 Add this


export default mongoose.model("HelpRequest", HelpRequestSchema);

