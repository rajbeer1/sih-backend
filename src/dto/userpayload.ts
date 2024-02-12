import { z } from "zod";

export const UserSignup = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  admin:z.string()
})


export const UserLogin = z.object({
  password: z.string(),
  email:z.string()
})