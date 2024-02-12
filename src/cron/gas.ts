import { Datainput } from "../models/data";
import { User } from "../models/user";

export async function checkGasLevelsForAllUsers(limit) {
  try {
    const users = await User.find().select('email');
    console.log(users);

    for (const user of users) {
      const gasReadings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(15)
        .select('gas createdAt -_id');
      
console.log(gasReadings)
      const highGasCount = gasReadings.filter(reading => reading.gas > limit).length;

      if (highGasCount > 5) {
        console.log(`Gas found for ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Failed to check gas levels for all users:', error);
  }
}
