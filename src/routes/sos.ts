import express from "express";
import {
    sendSos,
    getSos,
    checkVibrationForSOS
} from '../controllers/sos'
import { isLoggedIn } from "../middleware/isloggedin";

export const router = express.Router();

router
    .post('/send', isLoggedIn, sendSos)
    .get('/get', getSos)
    .get('/vibration', isLoggedIn, checkVibrationForSOS)
