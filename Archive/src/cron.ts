import cron from 'node-cron';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';
import { checkSosforadmin } from './cron/sosadmin';

checkSosforadmin();
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
