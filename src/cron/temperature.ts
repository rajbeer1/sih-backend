import { Datainput } from "../models/data";
import { User } from "../models/user";

export async function checkTemperatureForAllUsers(limit) {
  try {
    const users = await User.find().select('email');
    console.log(users);

    for (const user of users) {
      const readings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(15)
        .select('temperature createdAt -_id');
      const highTemperatureReadings = readings.filter(reading => reading.temperature > limit);
      if (highTemperatureReadings.length > 0) {
        console.log(`Temperature too high for ${user.email}`);
      }

      if (readings.length > 0) {
        const temperatures = readings.map(reading => reading.temperature);
        const maxTemperature = Math.max(...temperatures);
        const minTemperature = Math.min(...temperatures);
        const temperatureDifference = Math.abs(maxTemperature - minTemperature);

        if (temperatureDifference > 8) {
          console.log(`Large variation for ${user.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Failed to check temperature for all users:', error);
  }
}
