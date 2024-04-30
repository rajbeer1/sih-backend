import { Datainput } from "../models/data";
import { User } from "../models/user";
import { Fine } from "../models/fine";
import SocketServer from "../socket";
export const removeFromUsers=(users, fine)=> {
  const fineSet = new Set(fine.map((item) => item.email));
  return users.filter((user) => !fineSet.has(user.email));
}
export async function checkGasLevelsForAllUsers(limit) {
  try {
    const user = await User.find().select('email -_id');
    const fine = await Fine.find({Fine: true}).select('email -_id').sort({createdAt:-1}).limit(1);
    const users = removeFromUsers(user, fine);

    for (const user of users) {
      const gasReadings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(15)
        .select('gas createdAt -_id');
      

      const highGasCount = gasReadings.filter(reading => reading.gas > limit).length;

      if (highGasCount > 5) {
        const instance = SocketServer.getInstance()
    console.log(user.email)
        instance.sosgas(user.email,{"message":{"title":"Harmful gases detected","data":"Take precaution of carrying the gas mask before stepping out"}})
      }
    }
  } catch (error) {
    console.error('Failed to check gas levels for all users:', error);
  }
}
