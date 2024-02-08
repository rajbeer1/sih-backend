import { timeStamp } from 'console';
import mongoose from 'mongoose';


const { Schema } = mongoose;

const datainputSchema = new Schema({
  vibration: { type: Number, required: true },
  distance:{type:Number ,required: true},
  temperature: { type: Number, required: true },
  pressure: { type: Number, required: true },
  altitude: { type: Number, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  email: { type: String, required: true },
  gas: { type: Number, reuired: true },
  air_particulate: {
    pm1: String,
    pm2: String,
    pm10: String
  }
}, {
  timestamps:true
});

export const Datainput = mongoose.model('Datainput', datainputSchema);