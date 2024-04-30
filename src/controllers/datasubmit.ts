import { NextFunction, Request, Response } from 'express';
import { data } from '../dto';
import { UserPayload } from '../middleware/isloggedin';
import { Datainput } from '../models/data';

export const dataSubmit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = req.user as UserPayload;

    const input = req.body;
    const parsed = data.safeParse(input);
    if (!parsed.success) {
      return res.status(400).json({
        message: 'pls enter proper data',
      });
    }

    const newDataInput = new Datainput({
      temperature: input.temperature,
      email: users.email,
      altitude: input.altitude,
      latitude: input.latitude,
      longitude: input.longitude,
      pressure: input.pressure,
      vibration: input.vibration,
      distance: input.distance,
      gas: input.gas,
    });

    const insert = await newDataInput.save();

    res.send(insert);
  } catch (err) {
    next(err);
  }
};
