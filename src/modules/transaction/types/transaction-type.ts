import { type Transaction, type TransactionPricing, type Pricing, type Product, type User, type LandingPage } from "@prisma/client";

export type TransactionItem = Transaction & {
    user?: User;
    landingPage?: LandingPage;
    transactionPricings?: (TransactionPricing & {
        pricing: Pricing & {
            product?: Product;
        }
    })[];
    isChecked?: boolean;
}