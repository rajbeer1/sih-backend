import mongoose from 'mongoose';
import { config } from '../config';
beforeAll(async () => {
  await mongoose.connect(config.DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.destroy();
});
