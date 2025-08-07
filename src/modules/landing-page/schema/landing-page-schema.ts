import {z} from "zod";

export const landingPageCreateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.optional(z.string()),
    type: z.optional(z.enum([
        'default',
        'home',
    ])),
})

export const landingPageUpdateSchema = z.object({
    title: z.optional(z.string()),
    slug: z.optional(z.string()),
    description: z.optional(z.string()),
    type: z.optional(z.enum([
        'default',
        'home',
    ])),
    isPublished: z.optional(z.boolean()),
})

export const landingPagePricingCreateSchema = z.object({
    pricingId: z.string().min(1, 'Pricing ID is required'),
})

export type LandingPageCreateSchema = z.infer<typeof landingPageCreateSchema>
export type LandingPageUpdateSchema = z.infer<typeof landingPageUpdateSchema>
export type LandingPagePricingCreateSchema = z.infer<typeof landingPagePricingCreateSchema>