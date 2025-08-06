import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Pricing} from "@prisma/client";
import type {PricingCreateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = PricingCreateSchema

// define output type
type Output = ApiResponse<{
    pricing: Pricing
}>

export function useCreatePricing(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['CreatePricing', businessId],
        mutationFn: async (data) => {
            const response = await Axios.post(`/api/businesses/${businessId}/pricings`, data);
            return response.data;
        },
        ...props,
    })
}