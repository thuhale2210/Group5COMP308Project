import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    sentiment: String,
    businessResponse: {
        text: String,
        respondedAt: Date,
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
