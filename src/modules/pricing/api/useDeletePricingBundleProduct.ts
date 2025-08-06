import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = {
    pricingId: string;
    productId: string;
}

// define output type
type Output = ApiResponse

export function useDeletePricingBundleProduct(props?: UseMutationOptions<Input, Output>) {
    const {businessId} = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['DeletePricingBundleProduct', businessId],
        mutationFn: async ({pricingId, productId}) => {
            const response = await Axios.delete(
                `/api/businesses/${businessId}/pricings/${pricingId}/bundle-products/${productId}`
            );
            return response.data;
        },
        ...props,
    })
}