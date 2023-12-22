import { User } from "../models/user";
import { Datainput } from "../models/data";

const checkForInactivity = async () => {
    console.log("Checking for inactivity...");

    const users = await User.find({});

    console.log(users);
};

export default checkForInactivity;
