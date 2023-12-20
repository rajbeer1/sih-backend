import mongoose from 'mongoose';

const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// User Model
export const User = mongoose.model('User', userSchema);
