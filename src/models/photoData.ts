import mongoose from 'mongoose';

const { Schema } = mongoose;

const photodataSchema = new Schema({
  image_url: String,
  ml_detail: String
});

export const photodata = mongoose.model('photodata', photodataSchema);