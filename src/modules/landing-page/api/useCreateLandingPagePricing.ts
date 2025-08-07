import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {LandingPagePricingCreateSchema} from "@/modules/landing-page/schema/landing-page-schema.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = LandingPagePricingCreateSchema & {
    landingPageId: string;
}

// define output type
type Output = ApiResponse<{
    landingPagePricing: any
}>

export function useCreateLandingPagePricing(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['CreateLandingPagePricing', businessId],
        mutationFn: async ({landingPageId, pricingId}) => {
            const response = await Axios.post(`/api/businesses/${businessId}/landing-pages/${landingPageId}/landing-page-pricings`, {
                pricingId
            });
            return response.data;
        },
        ...props,
    })
}