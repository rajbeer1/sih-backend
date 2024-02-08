import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import { router as sos } from './routes/sos'
import connectToDB from './utils/connect-db';
import { checkVibrationsForAllUsers} from './cron/vibration';

import cron from 'node-cron';
dotenv.config();
connectToDB();
const app: Express = express();


//cron.schedule('* * * * *', () => {
  //console.log('Running the checkVibrations cron job');
  //checkVibrations();
//});
checkVibrationsForAllUsers('vibration')

app.use(express.json());
app.use(cors());
app.use('/auth', auth)
app.use('/data', data)
app.use('/sos', sos)

app.listen( 6000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
