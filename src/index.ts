import { Server } from './app';
import { config } from './config';
import { checkSosforadmin } from './cron/sosadmin';
import cron from 'node-cron';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';
import { deleteFine } from './cron';

config.databaseConnection();
config.verifyConfig();
cron.schedule('*/2 * * * *', () => {
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
  setTimeout(() => {
    console.log('Checking sosforadmin');
    checkSosforadmin();
  }, 90000);
});
checkGasLevelsForAllUsers(250)
cron.schedule('*/15 * * * *', () => {
  deleteFine();
})

Server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
