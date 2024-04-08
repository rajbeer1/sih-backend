import mongoose from 'mongoose';
const { Schema } = mongoose;
const datainputSchema = new Schema({
  vibration: { type: Number, required: true },
  distance:{type:Number ,required: true},
  temperature: { type: Number, required: true },
  pressure: { type: Number, required: true },
  altitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  email: { type: String, required: true },
  gas: { type: Number, required: true },
  
  
}, {
  timestamps:true
});

export const Datainput = mongoose.models.datainput ||mongoose.model('Datainput', datainputSchema);