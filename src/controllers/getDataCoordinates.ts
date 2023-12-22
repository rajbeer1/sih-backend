import { Datainput } from "../models/data";
import { Response, Request } from "express";

const getDataCoordinates = async (req: Request, res: Response) => {
    const data = await Datainput.aggregate([
        { $sort: { createdAt: -1 } }, // Sort by createdAt field in descending order
        { $group: { _id: "$email", latestEntry: { $first: "$$ROOT" } } }, // Group by email and get the first document in each group
        { $replaceRoot: { newRoot: "$latestEntry" } } // Replace the root document with the latestEntry document
    ]);

    res.json(data);
}

export { getDataCoordinates };