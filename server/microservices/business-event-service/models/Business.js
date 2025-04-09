import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deals: [String],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Business', businessSchema);
