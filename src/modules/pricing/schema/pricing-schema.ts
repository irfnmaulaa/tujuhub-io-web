import {z} from "zod";

export const pricingCreateSchema = z.object({
    title: z.string().min(1),
    description: z.optional(z.string()),
    type: z.enum([
        'individual',
        'bundle',
    ]),
    productId: z.optional(z.string()),
    currency: z.string(),
    price: z.number(),
})

export const pricingUpdateSchema = z.object({
    title: z.optional(z.string()),
    description: z.optional(z.string()),
    currency: z.optional(z.string()),
    price: z.optional(z.number()),
})

export const pricingBundleCreateSchema = z.object({
    productId: z.string().min(1),
    pricingId: z.string().min(1),
})

export type PricingCreateSchema = z.infer<typeof pricingCreateSchema>
export type PricingUpdateSchema = z.infer<typeof pricingUpdateSchema>
export type PricingBundleCreateSchema = z.infer<typeof pricingBundleCreateSchema>