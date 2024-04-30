import { Datainput } from "../models/data";
import { User } from "../models/user";
import SocketServer from "../socket";
import { Fine } from '../models/fine';
import { removeFromUsers } from './gas';
export async function checkVibrationsForAllUsers() {
  try {

    const user = await User.find().select('email -_id');
    const fine = await Fine.find({ Fine: true })
      .select('email -_id')
      .sort({ createdAt: -1 })
      .limit(1);
    const users = removeFromUsers(user, fine);


    for (const user of users) {
      const readings = await Datainput.find({ email: user.email, vibration: 0 })
        .sort({createdAt: -1})
        .limit(15)
        .select(`vibration createdAt -_id`);


      if (readings.length === 15) {
        const instance = SocketServer.getInstance()
        console.log(user.email);
        instance.sosvibration(user.email,{"message":{"title":"are you struck?","data":"the machine is not moving "}})
      } 
    }
  } catch (error) {
    console.error('Failed to check vibrations for all users:', error);
  }
}
