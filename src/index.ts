import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import connectToDB from './utils/connect-db';
dotenv.config();
connectToDB();
const app: Express = express();

app.use(express.json());
app.use(cors());
app.use('/auth', auth)
app.use('/data',data)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
