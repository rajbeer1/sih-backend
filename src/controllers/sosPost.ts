import { Sos } from '../models/sos';
import { Datainput } from '../models/data';

import { NextFunction, Request, Response } from 'express';
import { UserPayload } from '../middleware/isloggedin';
import { Admin } from '../models/admin';
import { User } from '../models/user';
import { checkSosforadmin } from '../cron/sosadmin';
export const postsos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserPayload;

    const { type } = req.body;
    const email = user.email;

    const data = await Datainput.findOne({ email: email })
      .sort({ createdAt: -1 })
      .exec();
const date = new Date()
    const sos = new Sos({
      email: data.email,
      lastLat: data.latitude.toFixed(3),
      lastLong: data.longitude.toFixed(3),
      time: date.toISOString(),
      temperature: data.temperature.toFixed(2),
      altitude: data.altitude.toFixed(2),
      type: type,
    })
    const saved = await sos.save();
    res.send(saved);
  } catch (err) {
    next(err);
  }
};

export const getsos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try { 

    const adminEmail = req.user.email;
    const admin = await Admin.findOne({ email: adminEmail });
    const AdminId = admin.email;
    const users = await User.find({ admin: AdminId });

    const data = [];
    for (const user of users) {
      const dat = await Sos.findOne({ email: user.email, resolved: false })
        .sort({ time: -1 })
        .limit(1)
        .select('-_id');
      data.push(dat);
    }
    const filteredArray = data.filter((item) => item !== null);
    if (filteredArray.length === 0){
      return res.send(
      [
        {
          lastLat: 0,
          lastLong: 0,
          time: 'N/A',
          __v: 0,
          altitude: 0,
          email: '',
          temperature: 0,
          type: '',
        },
      ]
    );
    }

    res.send(filteredArray);
  } catch (err) {
    next(err);
  }
};
export const updatesos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, time } = req.body;
    const update = await Sos.deleteMany({ email: email });
    if (update) {
      checkSosforadmin()
    }
    res.send(update);
  } catch (err) {
    next(err);
  }
};
