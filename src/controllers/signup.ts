import { Request, Response } from "express";
import { UserSignup } from "../dto";
import { handleErrors,password_crypt,create_token } from "../utils";
import * as EmailValidator from 'email-validator';
import { User } from "../models/user";
import { Admin } from "../models/admin";
export const signup = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const parsing = UserSignup.safeParse(data);
    if (!parsing.success) {
      return res.status(400).json({
      "message":"pls enter proper data"
      })
    }
    
    if (!EmailValidator.validate(data.email)) {
      return res.status(400).json({
        "message":"email is invalid"
      })
    } const email = data.email
    const isadmin = await Admin.findOne({ email })
    if (isadmin) {
        return res.json({"message":"email belongs to a Admin"})
    }
    const findadmin = await Admin.findOne({ email: parsing.data.admin })
    if(!findadmin) return res.status(400).json({
        "message":"Admin doesn't exist"
    })
    const alreadyuser = await User.findOne({ email })
    if(alreadyuser) return res.status(400).json({
        "message":"Miner already exists"
      })
    const hashedpassword = await password_crypt(data.password);
    const token = await create_token(data.email,data.name,findadmin.email);
   const newUser = new User({
  name: data.name,
  password: hashedpassword, 
     email: data.email,
  admin: findadmin.id
});

const insert = await newUser.save();
    res.set('Authorization', `Bearer ${token}`);

    res.json({
      "data": insert,
      "token":token
  })

  } catch (err) {
    handleErrors(err,res)
  }
}