import { Datainput } from '../models/data';
import { Response, Request } from 'express';
import { handleErrors } from '../utils';
import { UserPayload } from '../middleware/isloggedin';

const getDataCoordinates = async (req: Request, res: Response) => {
  const data = await Datainput.aggregate([
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
};
const getCoordinatesWithinRadius = async (req: Request, res: Response) => {
  try {
    const data = await Datainput.aggregate([
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
      const user = req.user as UserPayload;
      const radiusKm = 50
      const email = user.email
    const referencePoint = data.find((item) => item.email === email);
      if (!referencePoint) {
        console.log(referencePoint)
      console.log('Email not found');
      return [];
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

    res.json(filteredData)
  } catch (error) {
    handleErrors(res, error);
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
export { getDataCoordinates, getCoordinatesWithinRadius };
