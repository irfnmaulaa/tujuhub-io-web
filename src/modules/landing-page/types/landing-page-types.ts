import { type LandingPage, type LandingPagePricing, type Pricing, type Product } from "@prisma/client";

export type LandingPageItem = LandingPage & {
    landingPagePricings?: (LandingPagePricing & {
        pricing: Pricing & {
            product?: Product;
        }
    })[];
    isChecked?: boolean;
}