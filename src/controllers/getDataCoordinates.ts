import { Datainput } from '../models/data';
import { Response, Request } from 'express';
import { handleErrors } from '../utils';
import { UserPayload } from '../middleware/isloggedin';
import { User } from '../models/user';
import { Admin } from '../models/admin';
const getDataCoordinates = async (req: Request, res: Response) => {
  try {
    // Assuming req.user contains the admin's email directly
    const adminEmail = req.user.email;
  console.log(adminEmail)
    // First, find the admin ID based on the admin's email
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const adminId = admin._id;

    // Adjust the aggregation pipeline to filter data inputs by the admin ID
    const data = await Datainput.aggregate([
      {
        $lookup: {
          from: 'users', // Assuming 'users' is the name of the collection
          localField: 'email',
          foreignField: 'email',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' },
      { $match: { 'user_info.admin': adminId } }, // Filter by admin ID
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
  console.log(data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
};

const getCoordinatesWithinRadius = async (req: Request, res: Response) => {
  try {
    // Fetch admin ID of the requesting user from User collection
    const userPayload = req.user as UserPayload;
    const user = await User.findOne({ email: userPayload.email });
    if (!user || !user.admin) {
      return res.status(404).json({ message: 'User or admin not found' });
    }
    const userAdminId = user.admin;

    // Adjust the aggregation pipeline to include a lookup to fetch admin from User collection
    const data = await Datainput.aggregate([
      {
        $lookup: {
          from: 'users', // Assuming 'users' is the collection name for User model
          localField: 'email',
          foreignField: 'email',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' }, // Unwind the user_info to access the fields
      { $match: { 'user_info.admin': userAdminId } }, // Match documents where admin is the same as the requesting user's admin
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
      console.log('Reference point not found');
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
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
