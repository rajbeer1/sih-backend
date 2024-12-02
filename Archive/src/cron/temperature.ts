import { Datainput } from "../models/data";
import { User } from "../models/user";
import SocketServer from "../socket";

export async function checkTemperatureForAllUsers(limit) {
  try {
    const users = await User.find().select('email');


    for (const user of users) {
      const readings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(15)
        .select('temperature createdAt -_id');
      const highTemperatureReadings = readings.filter(reading => reading.temperature > limit);
      if (highTemperatureReadings.length > 0) {
        const instance = SocketServer.getInstance()

        instance.sostemp(user.email, { "message": { "title": "High temperature detected", "data": "the temperature is too high outside take precaution" } })
        return
      }

      if (readings.length > 0) {
        const temperatures = readings.map(reading => reading.temperature);
        const maxTemperature = Math.max(...temperatures);
        const minTemperature = Math.min(...temperatures);
        const temperatureDifference = Math.abs(maxTemperature - minTemperature);

        if (temperatureDifference > 8) {
          const instance = SocketServer.getInstance()

          instance.sostemp(user.email, { "message": { "title": "large variation in temperature detected", "data": "the variation is high pls take into account before stepping out" } })
          return
        }
      }
    }
  } catch (error) {
    console.error('Failed to check temperature for all users:', error);
  }
}
