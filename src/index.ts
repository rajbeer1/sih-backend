import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import { router as sos } from './routes/sos';
import connectToDB from './utils/connect-db';
import { createServer } from 'http';
const app: Express = express();
app.use(cors());
import cron from 'node-cron';
import SocketServer from './socket';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';
dotenv.config();
connectToDB();

const server = createServer(app);
SocketServer.getInstance(server);

cron.schedule('*/5 * * * *', () => {
  console.log('Checking gas levels');
  checkGasLevelsForAllUsers(250);
  setTimeout(() => {
    console.log('Checking vibrations');
    checkVibrationsForAllUsers();
  }, 30000);
  setTimeout(() => {
    console.log('Checking temperature');
    checkTemperatureForAllUsers(45);
  }, 60000);
});

app.use(express.json());

app.use('/auth', auth);
app.use('/data', data);
app.use('/sos', sos);

server.listen(3200, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
