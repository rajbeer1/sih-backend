import { NextFunction, Request, Response } from 'express';
import { data } from '../dto';
import { UserPayload } from '../middleware/isloggedin';
import { Datainput } from '../models/data';

export const dataGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const type = req.params.toget;
    const limit = req.query.limit as any;
    const users = req.user as UserPayload;
    const result = await Datainput.find({ email: users.email })
      .sort({ createdAt: -1 })
      .select(`${type} -_id`)
      .limit(limit);

    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const dataForbox = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.user as UserPayload;
    const email = data.email;
    const result = await Datainput.find({ email })
      .sort({ createdAt: -1 })
      .select('temperature latitude longitude altitude')
      .limit(1);
    if (!result) {
      return res.send([])
    }

    const distance = await Datainput.find({ email })
      .sort({ createdAt: -1 })
      .select('distance')
      .limit(15);
    const vibration = await Datainput.find({ email })
      .sort({ createdAt: -1 })
      .select('vibration')
      .limit(15);
    let ismoving = 0;
    let vib = 0;
    let collision = 0;
    vibration.map((vibr) => {
      if (vibr.vibration === 1) {
        ismoving++;
      }
    });
    if (ismoving > 6) {
      vib = 1;
    }

    distance.map((dist) => (collision += dist.distance));
    const distaence = collision / distance.length;
    const tosend = {
      temperature: result[0].temperature.toFixed(2),
      latitude: result[0].latitude.toFixed(4),
      longitude: result[0].longitude.toFixed(4),
      altitude: result[0].altitude.toFixed(3),
      distance: distaence.toFixed(3),
      vibration: vib,
    };

    res.send(tosend);
  } catch (err) {
    next(err);
  }
};
