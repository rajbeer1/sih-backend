import cron from 'node-cron';
import { checkVibrationsForAllUsers } from './cron/vibration';
import { checkGasLevelsForAllUsers } from './cron/gas';
import { checkTemperatureForAllUsers } from './cron/temperature';
import { checkSosforadmin } from './cron/sosadmin';
import { Fine } from './models/fine';
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
export const deleteFine = async () => {
  const currentTime = new Date();
  const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60 * 1000);
  const result = await Fine.deleteMany({
    createdAt: { $lt: fifteenMinutesAgo },
  });
};