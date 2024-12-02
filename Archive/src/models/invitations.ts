import mongoose from 'mongoose';
const { Schema } = mongoose;
const InvitationSchema = new Schema({
  admin: { type: String, required: true},
  user_email: { type: String, required: true},
  approved: { type: Boolean, required: true },
});
export const Invitation =
  mongoose.models.invitation || mongoose.model('Invitation', InvitationSchema);
