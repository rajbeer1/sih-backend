import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admin: {
    type: Schema.Types.ObjectId, 
    ref: 'Admin', 

  },
});

export const User = mongoose.model('User', userSchema);
