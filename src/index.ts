import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import { router as sos } from './routes/sos'
import connectToDB from './utils/connect-db';
import checkForInactivity from './cron/sosCron';

import cron from 'node-cron';
dotenv.config();
connectToDB();
const app: Express = express();

// cron.schedule('*/5 * * * * *', () => {
//   checkForInactivity();
// });

app.use(express.json());
app.use(cors());
app.use('/auth', auth)
app.use('/data', data)
app.use('/sos', sos)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
