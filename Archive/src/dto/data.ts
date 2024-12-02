import { z } from "zod";

export const data = z.object({
  vibration: z.number(),
  temperature: z.number(),
  pressure: z.number(),
  altitude: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number(),
  gas: z.number(),
  
})

