import { Request, Response } from "express";
import { handleErrors,} from "../utils";
import { PrismaClient } from '@prisma/client'
import { data } from "../dto";
import { string } from "zod";
import { UserPayload } from "../middleware/isloggedin";
import { Datainput } from "../models/data";
const prisma = new PrismaClient()

export const dataSubmit = async (req: Request,res:Response) => {
  const users =req.user as UserPayload;
  console.log(users)
  const input = req.body;
  const parsed = data.safeParse(input);
  if (!parsed.success) {
      return res.status(400).json({
        "message": "pls enter proper data"
      })
  }
  console.log(parsed.data)
 const newDataInput = new Datainput({
  temperature: input.temperature,
  email: users.email,
  altitude: input.altitude,
  latitude: input.latitude,
  longitude: input.longitude,
  pressure: input.pressure,
  vibration: input.vibration
});

const insert = await newDataInput.save();
  console.log("efs");
  res.send(insert)
  




}