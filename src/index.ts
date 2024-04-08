import { Server } from './app';
import dotenv from 'dotenv';
import connectToDB from './utils/connect-db';
import cron from 'node-cron';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';
import { checkSosforadmin } from './cron/sosadmin';
dotenv.config();
connectToDB();

// checkSosforadmin();
// cron.schedule('*/5 * * * *', () => {
//   console.log('Checking gas levels');
//   checkGasLevelsForAllUsers(250);
//   setTimeout(() => {
//     console.log('Checking vibrations');
//     checkVibrationsForAllUsers();
//   }, 30000);
//   setTimeout(() => {
//     console.log('Checking temperature');
//     checkTemperatureForAllUsers(45);
//   }, 60000);
// });
Server.listen(3200, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
