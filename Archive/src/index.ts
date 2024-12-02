import { Server } from './app';
import { config } from './config';
config.databaseConnection()
config.verifyConfig()
import { checkSosforadmin } from './cron/sosadmin';

checkSosforadmin();
Server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
