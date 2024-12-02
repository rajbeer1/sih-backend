import { z } from "zod";

export const photoData = z.object({
  image_url: z.string(),
  ml_detail: z.string(),
 
})

