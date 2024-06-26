import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admin: {
    type: String

  },
});

export const User = mongoose.models.User||mongoose.model('User', userSchema);
