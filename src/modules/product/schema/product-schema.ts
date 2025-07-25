import {z} from "zod";

export const productCreateSchema = z.object({
    title: z.string(),
    summary: z.optional(z.string()),
    productType: z.enum([
        'course',
        'event',
        'membership',
    ])
})

export const productUpdateSchema = z.object({
    title: z.optional(z.string()),
    summary: z.optional(z.string()),
    isPublished: z.optional(z.boolean()),
})

export type ProductCreateSchema = z.infer<typeof productCreateSchema>
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>
