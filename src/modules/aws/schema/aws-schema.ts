import {z} from "zod";

export const generatePresignUrlSchema = z.object({
    fileName: z.string(),
    isPrivateBucket: z.optional(z.boolean()),
    type: z.enum([
        'get',
        'put',
        'delete',
    ])
})

export const putObjectSchema = z.object({
    file: z.any(),
    signedUrl: z.string(),
})


export type GeneratePresignUrlSchema = z.infer<typeof generatePresignUrlSchema>
export type PutObjectSchema = z.infer<typeof putObjectSchema>
