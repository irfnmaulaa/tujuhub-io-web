import { z } from 'zod';

const transactionPricingSchema = z.object({
    pricingId: z.string(),
    quantity: z.number().optional(),
});

const transactionCreateSchema = z.object({
    userFullName: z.string(),
    userEmail: z.string().email(),
    userPhone: z.string(),
    transactionPricings: z.array(transactionPricingSchema),
    status: z.enum(['pending', 'completed', 'expired']).optional(),
    provider: z.enum(['xendit', 'manual']),
    landingPageId: z.string().optional(),
    successRedirectUrl: z.string().optional(),
    automationId: z.string().optional(),
    generateInvoice: z.optional(z.boolean()),
});

const transactionUpdateSchema = z.object({
    status: z.enum(['pending', 'completed', 'expired']).optional(),
    automationId: z.string().optional(),
});

export { transactionPricingSchema, transactionCreateSchema, transactionUpdateSchema };
export type TransactionPricingSchema = z.infer<typeof transactionPricingSchema>;
export type TransactionCreateSchema = z.infer<typeof transactionCreateSchema>;
export type TransactionUpdateSchema = z.infer<typeof transactionUpdateSchema>;