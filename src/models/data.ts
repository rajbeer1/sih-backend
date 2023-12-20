import mongoose from 'mongoose';

const { Schema } = mongoose;

const datainputSchema = new Schema({
  vibration: { type: Number, required: true },
  temperature: { type: Number, required: true },
  pressure: { type: Number, required: true },
  altitude: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  email: { type: String, required: true },
});

// Datainput Model
export const Datainput = mongoose.model('Datainput', datainputSchema);