import mongoose from 'mongoose';

const { Schema } = mongoose;

const FineSchema = new Schema(
  {
    
    Fine: { type: Boolean, default: false },
    email:{type: String}
  },
  {
    timestamps: true,
  }
);

export const Fine = mongoose.models.Fine || mongoose.model('Fine', FineSchema);
