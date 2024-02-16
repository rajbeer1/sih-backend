import { Sos } from "../models/sos"
import { Datainput } from "../models/data"
import { handleErrors } from "../utils"
import { Request,Response } from "express"
import { UserPayload } from "../middleware/isloggedin"
import { Admin } from "../models/admin"
import { User } from "../models/user"
export const postsos = async(req:Request,res:Response) => {
  try {
    const user = req.user as UserPayload
    const {type} =req.body
    const email = user.email
    console.log(email)
     const data = await Datainput.findOne({ email: email })
      .sort({ createdAt: -1 }) 
      .exec(); 
await Sos.deleteMany({email:email})
    const sos = new Sos({
      email: data.email,
      lastLat: data.latitude.toFixed(3),
      lastLong: data.longitude.toFixed(3),
      time: data.createdAt,
      temperature: data.temperature.toFixed(2),
      altitude: data.altitude.toFixed(2),
      type: type
    })
    const saved = await sos.save()
    res.send(saved)
  } catch (error) {
    res.send(error)
  }
}

export const getsos =async (req:Request,res:Response) => {
  try {
    const adminEmail = req.user.email;
    const admin = await Admin.findOne({ email: adminEmail });
    const AdminId = admin._id;
    const users = await User.find({ admin: AdminId })
    
    const data = [];
    for (const user of users){
      const dat = await Sos.findOne({ email: user.email,resolved:false }).sort({ time: -1 }).limit(1).select('-_id')
      data.push(dat);
    }
    const filteredArray = data.filter((item) => item !== null);
    res.send(filteredArray)
  } catch (error) {
    handleErrors(error,res)
  }
}
export const updatesos = async (req:Request,res:Response) => {
  try {
    const { email, time } = req.body;
    const update = await Sos.findOneAndUpdate({ email: email, time: time }, { resolved: true })
    res.send(update)
  } catch (error) {
    handleErrors(error,res)
  }
}