import { z } from "zod";

export const data = z.object({
  vibration: z.number(),
  temperature: z.number(),
  pressure: z.number(),
  altitude: z.number(),
  latitude: z.string(),
  longitude: z.string(),
})

