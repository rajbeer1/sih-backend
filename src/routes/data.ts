import express, { Request, Response } from "express";
import { dataSubmit, photosubmit, getPhotoData, getDataCoordinates, getCoordinatesWithinRadius } from "../controllers";
import { dataGet } from "../controllers";
import { isLoggedIn } from "../middleware/isloggedin";
export const router = express.Router();


router
    .post('/submit', isLoggedIn, dataSubmit)
    .get('/cords', getDataCoordinates).get('/cords/email',isLoggedIn,getCoordinatesWithinRadius)
    .post('/photo', photosubmit)
    .get('/photo/get', getPhotoData).get('/:toget', isLoggedIn, dataGet)



