import mongoose from 'mongoose';

const { Schema } = mongoose;

const sosSchema = new Schema({
    lastLat: { type: Number, required: true },
    lastLong: { type: Number, required: true },
    time: { type: Date, required: true },
    temperature: { type: Number, required: true },
    altitude: { type: Number, required: true },
    email: { type: String, required: true },
})

export const Sos = mongoose.model('Sos', sosSchema);