import mongoose from 'mongoose';

const { Schema } = mongoose;

const photodataSchema = new Schema({
  image_url: String,
  ml_detail: String
});

export const photodata = mongoose.models.photodata||mongoose.model('photodata', photodataSchema);