import { Datainput } from "../models/data";
import { User } from "../models/user";
import SocketServer from "../socket";
export async function checkVibrationsForAllUsers() {
  try {

    const users = await User.find().select('email');
    console.log(users);

    for (const user of users) {
      const readings = await Datainput.find({ email: user.email, vibration: 0 })
        .sort({createdAt: -1})
        .limit(15)
        .select(`vibration createdAt -_id`);
        console.log(readings)

      if (readings.length === 15) {
        const instance = SocketServer.getInstance()
        instance.sendDataToUserByEmail(user.email,{"message":{"title":"are you struck?","data":"the machine is not moving "}})
      } else {

        console.log(`No danger detected for ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Failed to check vibrations for all users:', error);
  }
}
