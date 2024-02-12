import express from "express";
import { signup, login } from "../controllers";
import { adminogin, adminsignup } from "../controllers/admin";
export const router = express.Router();


router
    .post('/signup', signup)
    .post('/login', login).post('/admin/signup',adminsignup).post('/admin/login',adminogin)



