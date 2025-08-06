import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const registerSchema = z.object({
    name: z.string().min(1, 'This field is required'),
    email: z.string().min(1, 'This field is required').email(),
    phone: z.string().min(1, 'This field is required').regex(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number'),
})

export const requestResetPasswordSchema = z.object({
    email: z.string().email(),
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'This field is required'),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type RequestResetPasswordSchema = z.infer<typeof requestResetPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
