import { Request, Response } from "express";
import { UserSignup } from "../dto";
import { handleErrors,password_crypt,create_token } from "../utils";
import * as EmailValidator from 'email-validator';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
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
    }
    const hashedpassword = await password_crypt(data.password);
    const token = await create_token(data.email);
    const insert = await prisma.user.create({
      data:{name:data.name,password:hashedpassword,email:data.email}
    })
    res.set('Authorization', `Bearer ${token}`);

    res.json({
      "data": insert,
      "token":token
  })

  } catch (err) {
    handleErrors(err,res)
  }
}