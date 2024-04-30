import express, { Express } from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import { router as auth } from './routes/auth';
import { router as data } from './routes/data';
import { router as sos } from './routes/sos';
import SocketServer from './socket';
import { createServer } from 'http';
import { errorHandler } from './utils';
export const app: Express = express();
app.use(cors());

export const Server = createServer(app);
SocketServer.getInstance(Server);
app.use(express.json());
app.use('/auth', auth);
app.use('/data', data);
app.use('/sos', sos);
app.use('/', (req: Request, res: Response) => {
  res.send({ hello: 'there' });
});
app.use(errorHandler)