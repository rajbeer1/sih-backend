import { Request, Response } from "express";
import { data } from "../dto";
import { UserPayload } from "../middleware/isloggedin";
import { Datainput } from "../models/data";

export const dataGet = async (req: Request,res:Response) => {
  const type = req.params.toget;
  const limi = req.query.limit as any;
  const users =req.user as UserPayload;
  const result = await Datainput.find({ email: users.email }).select(`${type} -_id`).limit(limi);

  res.send(result);


}