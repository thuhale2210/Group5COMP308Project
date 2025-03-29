import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["resident", "business_owner", "community_organizer"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export default mongoose.model("User", UserSchema);
