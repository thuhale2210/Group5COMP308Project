// import mongoose from 'mongoose';

// const communityPostSchema = new mongoose.Schema({
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     category: { type: String, required: true, enum: ["news", "discussion"] },
//     createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('CommunityPost', communityPostSchema);

const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ["news", "discussion"], required: true },
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);

