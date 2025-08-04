import {z} from "zod";

export const productCreateSchema = z.object({
    title: z.string(),
    summary: z.optional(z.string()),
    price: z.optional(z.number()),
    productType: z.enum([
        'course',
        'event',
        'membership',
    ]),
    thumbnailSrc: z.optional(z.string()),
})

export const productUpdateSchema = z.object({
    title: z.optional(z.string()),
    summary: z.optional(z.string()),
    price: z.optional(z.number()),
    isPublished: z.optional(z.boolean()),
    thumbnailSrc: z.optional(z.any()),
})

export type ProductCreateSchema = z.infer<typeof productCreateSchema>
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>
