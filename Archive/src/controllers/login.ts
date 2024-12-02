import { NextFunction, Request, Response } from "express";
import { Pass,tokens } from "../utils";
import { UserLogin } from "../dto";
import * as EmailValidator from 'email-validator';
import { User } from "../models/user";
export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const data = req.body;
    const parsing = UserLogin.safeParse(data);
    if (!parsing.success) {
      return res.status(400).json({
        "message": "pls enter proper data"
      })
    }
    if (!EmailValidator.validate(data.email)) {
      return res.status(400).json({
        "message": "email is invalid"
      })
    }
    const find = await User.findOne({ email: data.email });

    if (!find) {
      return res.status(400).json({
        "message":"Miner doesn't exist"
      })
    }


    const compare = await Pass.password_compare(data.password, find.password);

    if (!compare) {
      return res.status(400).json({
        "message":"password doesn't match"
      })
    }
    const token = await tokens.create_token(data.email,find.name);
    res.set('Authorization', `Bearer ${token}`);
    return res.json({
      "data": find,
      "token":token
  })
} catch (err) {
  next(err)
  }
}