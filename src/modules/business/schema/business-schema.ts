import {z} from "zod";

export const businessCreateSchema = z.object({
    name: z.string(),
    description: z.optional(z.string()),
})

export type BusinessCreateSchema = z.infer<typeof businessCreateSchema>
