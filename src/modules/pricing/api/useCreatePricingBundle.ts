import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import type {PricingBundleCreateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = PricingBundleCreateSchema

// define output type
type Output = ApiResponse<{
    pricingBundle: any;
}>

export function useCreatePricingBundle(props?: UseMutationOptions<Input, Output>) {
    const {businessId} = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['CreatePricingBundle', businessId],
        mutationFn: async (data: Input) => {
            const {pricingId, ...rest} = data
            const response = await Axios.post(
                `/api/businesses/${businessId}/pricings/${pricingId}/bundle-products`,
                rest
            )
            return response.data
        },
        ...props
    })
}