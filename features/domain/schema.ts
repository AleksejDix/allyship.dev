import { z } from "zod"

export const themeSettingsSchema = z.object({
  theme: z.enum(["LIGHT", "DARK", "BOTH"]),
  domainId: z.string(),
  spaceId: z.string(),
})

export type ThemeSettings = z.infer<typeof themeSettingsSchema>
