import { Datainput } from '../models/data';
import { Response, Request, NextFunction } from 'express';

import { UserPayload } from '../middleware/isloggedin';
import { User } from '../models/user';
import { Admin } from '../models/admin';
const getDataCoordinates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminEmail = req.user.email;

    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const adminId = admin.email;

    const data = await Datainput.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' },
      { $match: { 'user_info.admin': adminId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$email',
          latestLatitude: { $first: '$latitude' },
          latestLongitude: { $first: '$longitude' },
        },
      },
      {
        $project: {
          _id: 0,
          email: '$_id',
          latitude: '$latestLatitude',
          longitude: '$latestLongitude',
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getCoordinatesWithinRadius = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userPayload = req.user as UserPayload;
    const user = await User.findOne({ email: userPayload.email });
    if (!user || !user.admin) {
      return res.status(404).json({ message: 'User or admin not found' });
    }
    const userAdminId = user.admin;

    const data = await Datainput.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' },
      { $match: { 'user_info.admin': userAdminId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$email',
          latestLatitude: { $first: '$latitude' },
          latestLongitude: { $first: '$longitude' },
        },
      },
      {
        $project: {
          _id: 0,
          email: '$_id',
          latitude: '$latestLatitude',
          longitude: '$latestLongitude',
        },
      },
    ]);

    const radiusKm = 50;
    const referencePoint = data.find(
      (item) => item.email === userPayload.email
    );
    if (!referencePoint) {
      return res.json([]);
    }

    const filteredData = data.filter((item) => {
      const distance = calculateDistance(
        referencePoint.latitude,
        referencePoint.longitude,
        item.latitude,
        item.longitude
      );
      return distance <= radiusKm;
    });

    res.json(filteredData);
  } catch (err) {
    next(err);
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

const getDataByTimeFrame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { timeframe } = req.params;
    const { email } = req.query;
    console.log(email);

    let dateLimit: Date;

    switch (timeframe) {
      case '1week':
        dateLimit = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 
        break;
      case '2weeks':
        dateLimit = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); 
        break;
      case '1month':
        dateLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
        break;
      case '6months':
        dateLimit = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000); 
        break;
      case 'all':
        dateLimit = new Date(0);
        break;
      default:
        return res.status(400).json({ message: 'Invalid timeframe' });
    }

    const data = await Datainput.find({
      createdAt: { $gte: dateLimit },
      email,
    }).sort({
      createdAt: 1,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export { getDataCoordinates, getCoordinatesWithinRadius, getDataByTimeFrame };
