import express from "express";
import {
  admininvite,
  adminlogin,
  adminsignup,
  signup,
  login,
} from '../controllers';
import { isLoggedIn } from "../middleware/isloggedin";
export const router = express.Router();


router
    .post('/signup', signup)
    .post('/login', login).post('/admin/signup',adminsignup).post('/admin/login',adminlogin).post('/admin/invite',isLoggedIn,admininvite)



