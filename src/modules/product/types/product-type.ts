import type {Product} from "@prisma/client";
import type {ItemType} from "@/shared/types/item-type.ts";

export type ProductItem = ItemType<Product>