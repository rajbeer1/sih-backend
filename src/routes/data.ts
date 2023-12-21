import express, { Request, Response } from "express";
import { dataSubmit,photosubmit } from "../controllers";
import { dataGet } from "../controllers";
import { isLoggedIn } from "../middleware/isloggedin";
export const router = express.Router();


router.post('/submit', isLoggedIn, dataSubmit).get('/:toget', isLoggedIn, dataGet).post('/photo', photosubmit);



