import { Request, Response } from "express"
import { photoData } from "../dto"
import { photodata } from "../models/photoData";

export const photosubmit = async (req: Request, res: Response) => {

  const data = req.body;
  const parsing = photoData.safeParse(data);
  if (!parsing.success) {
    return res.status(400).json({
      "message": "pls enter proper data"
    })
  }

  const saved = new photodata({
    ml_detail: data.ml_detail,
    image_url: data.image_url
  })
  const insert = await saved.save();

  res.send(insert)
}

export const getPhotoData = async (req: Request, res: Response) => {
  const data = await photodata.findOne().sort({ _id: -1 });
  res.status(200).json({
    "data": data
  })
}
