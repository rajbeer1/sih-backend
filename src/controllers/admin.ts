import { Admin } from "../models/admin"
import { User } from "../models/user";
import { Request,Response } from "express";
import { create_token, password_crypt } from "../utils";
import * as EmailValidator from 'email-validator';
import { password_compare } from "../utils";
import { handleErrors } from "../utils";
export const adminogin = async(req: Request, res: Response) => {
  try {
    const data = req.body;
    
    
    if (!EmailValidator.validate(data.email)) {
      return res.status(400).json({
        "message": "email is invalid"
      })
    }
    const find = await Admin.findOne({ email: data.email });

    if (!find) {
      return res.status(400).json({
        "message":"Miner doesn't exist"
      })
    }
    
    const compare = await password_compare(data.password, find.password);
    
    if (!compare) {
      return res.status(400).json({
        "message":"password doesn't match"
      })
    }
    const token = await create_token(data.email,find.name);
    res.set('Authorization', `Bearer ${token}`);
    res.json({
      "data": find,
      "token":token
  })
} catch (err) {
    handleErrors(res,err)
  }
}


export const adminsignup = async(req: Request, res:Response) => {
  const { email, password, name } = req.body as any;
  const already = await Admin.findOne({ email })
  if (!EmailValidator.validate(email)) {
      return res.status(400).json({
        "message":"email is invalid"
      })
    }
  if (already) {
    return res.json({"message":"Admin already exits"})
  }
  const finuser = await User.findOne({ email })
  if (finuser) {
    return res.json({"message":"email belongs to a Miner"})
  }
  const hashedpassword = await password_crypt(password)
  const added = new Admin({ email, name, password: hashedpassword })
   const saved = await added.save()
  const token = await create_token(email, name);
  res.set('Authorization', `Bearer ${token}`);
    res.json({
      "data": saved,
      "token":token
  })
}