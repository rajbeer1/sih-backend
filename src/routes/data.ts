import express, { Request, Response } from "express";
import { dataSubmit, getDataCoordinates, getCoordinatesWithinRadius,miner,getDataByTimeFrame} from "../controllers";
import { dataForbox } from "../controllers/dataget";
import { dataGet } from "../controllers";
import { isLoggedIn } from "../middleware/isloggedin";
export const router = express.Router();


router
  .post('/submit', isLoggedIn, dataSubmit)
  .get('/box', isLoggedIn, dataForbox)
  .get('/miners', isLoggedIn, miner)
  .get('/cords', isLoggedIn, getDataCoordinates)
  .get('/cords/email', isLoggedIn, getCoordinatesWithinRadius)
  .get('/:toget', isLoggedIn, dataGet)
  .get('/graph/:timeframe', isLoggedIn, getDataByTimeFrame);




