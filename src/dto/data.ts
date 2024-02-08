import { z } from "zod";

export const data = z.object({
  vibration: z.number(),
  temperature: z.number(),
  pressure: z.number(),
  altitude: z.number(),
  latitude: z.string(),
  longitude: z.string(),
  distance: z.number(),
  gas: z.number(),
  air_particulate: z.object({
    pm1: z.string(),
    pm2: z.string(),
    pm10: z.string()
  })
})

