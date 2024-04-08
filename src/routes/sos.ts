import express from "express";
export const router = express.Router();
import { postsos,getsos, updatesos } from "../controllers/sosPost";
import { isLoggedIn } from "../middleware/isloggedin";
router.post('/', isLoggedIn, postsos).get('/', isLoggedIn, getsos).post('/update', updatesos)
  



