import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import connectToDB from './utils/connect-db';
import { createServer } from 'http';
const app: Express = express();
app.use(cors())
import cron from 'node-cron';
import SocketServer from './socket';
import { checkVibrationsForAllUsers } from './cron/vibration';
dotenv.config();
connectToDB();

const server = createServer(app);
SocketServer.getInstance(server)

// cron.schedule('* * * * *', () => {
//   console.log('Running the checkVibrations cron job');
//    checkVibrationsForAllUsers()
// });
// setInterval(checkVibrationsForAllUsers,20000)



app.use(express.json());

app.use('/auth', auth)
app.use('/data', data)


server.listen( 3200, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
