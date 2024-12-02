import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  email: string;
}

class SocketServer {
  private static instance: SocketServer;
  public io: Server;

  private constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        credentials: true,
      },
    });
    this.configureSocket();
  }

  public static getInstance(httpServer?: HttpServer): SocketServer {
    if (!SocketServer.instance && httpServer) {
      SocketServer.instance = new SocketServer(httpServer);
    }
    return SocketServer.instance;
  }

  private configureSocket(): void {
    this.io.use((socket: Socket, next) => {
      try {
        const token = socket.handshake.query.token as string;

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        socket.join(decoded.email);
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {

      console.log(socket.id);
    });
  }

  public sostemp(email: string, data: any): void {
    this.io.to(email).emit('SOS-temp', data);
  }
  public sosgas(email: string, data: any): void {
    this.io.to(email).emit('SOS-gas', data);
  }
  public sosvibration(email: string, data: any): void {
    this.io.to(email).emit('SOS-vibration', data);
  }
  public checksosadmin(email: string, data: any): void {
    this.io.to(email).emit('SOS-admin', data);
  }
}

export default SocketServer;
