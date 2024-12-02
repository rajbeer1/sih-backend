import mongoose from 'mongoose';
const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },

});
export const Admin =
  mongoose.models.admin || mongoose.model('admin', userSchema);
