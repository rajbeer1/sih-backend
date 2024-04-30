import 'dotenv/config';
import mongoose from 'mongoose';

class Config {
  public readonly PORT: number;
  public readonly DATABASE_URL: string;
  public readonly JWT_SECRET: string;
  public readonly email_sender: string;
  public readonly email_sender_pass: string;
  public readonly Front_url: string;

  constructor() {
    this.PORT = Number(process.env.PORT) || 3500;
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.JWT_SECRET = process.env.JWT_SECRET || 'udduLovesToGetDominated';
    this.email_sender = process.env.email_sender || 'royu49@gmail.com';
    this.email_sender_pass =
      process.env.email_sender_pass || 'eqir lqwm gxml iebzP';
    this.Front_url =
      process.env.Front_url || '';
  }

  public verifyConfig(): void {
    const errors: string[] = [];

    const envVariables = ['DATABASE_URL','Front_url'];

    envVariables.forEach((envVariable) => {
      if (!process.env[envVariable]) {
        errors.push(`Missing ${envVariable} in environment variables`);
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }

  public databaseConnection(): void {
    mongoose.connect(this.DATABASE_URL);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('Connected to database');
    });
  }
}

export const config: Config = new Config();
