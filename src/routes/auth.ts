import express, { Request, Response } from "express";
import { signup, login } from "../controllers";
export const router = express.Router();


router
    .post('/signup', signup)
    .post('/login', login)



