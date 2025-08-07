import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {LandingPageCreateSchema} from "@/modules/landing-page/schema/landing-page-schema.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";
import type {LandingPageItem} from "@/modules/landing-page/types/landing-page-types.ts";

// define input type
type Input = LandingPageCreateSchema

// define output type
type Output = ApiResponse<{
    landingPage: LandingPageItem
}>

export function useCreateLandingPage(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['CreateLandingPage', businessId],
        mutationFn: async (data) => {
            const response = await Axios.post(`/api/businesses/${businessId}/landing-pages`, data);
            return response.data;
        },
        ...props,
    })
}