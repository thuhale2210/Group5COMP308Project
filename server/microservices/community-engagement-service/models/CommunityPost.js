import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['News', 'Discussion'],
    required: true,
  },
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.model("CommunityPost", CommunityPostSchema);
