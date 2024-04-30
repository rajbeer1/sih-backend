import { Datainput } from "../models/data";
import { User } from "../models/user";
import SocketServer from "../socket";
export async function checkGasLevelsForAllUsers(limit) {
  try {
    const users = await User.find().select('email');


    for (const user of users) {
      const gasReadings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(15)
        .select('gas createdAt -_id');
      

      const highGasCount = gasReadings.filter(reading => reading.gas > limit).length;

      if (highGasCount > 5) {
        const instance = SocketServer.getInstance()
    console.log(user.email)
        instance.sosgas(user.email,{"message":{"title":"Harmful gases detected","data":"pls take precaution of carrying the gas mask before stepping out"}})
      }
    }
  } catch (error) {
    console.error('Failed to check gas levels for all users:', error);
  }
}
