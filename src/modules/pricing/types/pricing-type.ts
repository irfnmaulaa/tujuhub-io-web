import type {ItemType} from "@/shared/types/item-type.ts"; 
import type {Pricing, PricingBundleProduct, Product} from "@prisma/client";

export type PricingItem = ItemType<Pricing & {
    bundleProducts?: (PricingBundleProduct & {
        product?: Product;
    })[]
}>