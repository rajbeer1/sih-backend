import express from "express";
export const router = express.Router();
import { postsos,getsos, updatesos,fine } from "../controllers/sosPost";
import { isLoggedIn } from "../middleware/isloggedin";
router.post('/', isLoggedIn, postsos).get('/', isLoggedIn, getsos).post('/update', updatesos).post('/fine',isLoggedIn,fine)
  



