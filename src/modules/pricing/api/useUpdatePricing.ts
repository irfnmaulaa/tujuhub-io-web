import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Pricing} from "@prisma/client";
import type {PricingUpdateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import type {ApiResponse, EditInput} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = EditInput<PricingUpdateSchema>

// define output type
type Output = ApiResponse<{
    pricing: Pricing
}>

export function useUpdatePricing(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['UpdatePricing', businessId],
        mutationFn: async ({id, data}) => {
            const response = await Axios.put(`/api/businesses/${businessId}/pricings/${id}`, data);
            return response.data;
        },
        ...props,
    })
}