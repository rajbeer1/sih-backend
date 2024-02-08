import { Datainput } from "../models/data";
import { User } from "../models/user";

export async function checkVibrationsForAllUsers(tocheck) {
  try {
    // Fetch all users
    const users = await User.find().select('email');
    console.log(users);

    // Iterate over each user
    for (const user of users) {
      
      const readings = await Datainput.find({ email: user.email })
        .sort({createdAt: -1})
        .limit(10)
        .select(`${tocheck} createdAt -_id`);

      console.log(readings);

      // Check if there are at least 2 readings to compare
      if (readings.length > 1) {
        for (let i = 0; i < readings.length - 1; i++) {
          // Calculate the difference between successive readings
          const difference = Math.abs(readings[i].vibration - readings[i + 1].vibration);
          
          // Define your threshold for logging "Danger"
          const threshold = 0.5;

          if (difference < threshold) {
            console.log(`Danger for ${user.email}`);
            break; // Stop checking further once "Danger" condition is met for a user
          }else{console.log(user.email)}
        }
      }
    }
  } catch (error) {
    console.error('Failed to check vibrations for all users:', error);
  }
}
