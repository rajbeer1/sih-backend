import { Server } from './app';
import { config } from './config';
config.databaseConnection()
config.verifyConfig()
import { checkSosforadmin } from './cron/sosadmin';

checkSosforadmin()
import cron from 'node-cron';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';


// cron.schedule('*/5= * * * *', () => {
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
checkGasLevelsForAllUsers(250);
Server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
