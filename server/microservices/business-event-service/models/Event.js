import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: Date,
    location: String,
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Event', eventSchema);