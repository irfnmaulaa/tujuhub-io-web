import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {LandingPageUpdateSchema} from "@/modules/landing-page/schema/landing-page-schema.ts";
import type {ApiResponse, EditInput} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";
import type {LandingPageItem} from "@/modules/landing-page/types/landing-page-types.ts";

// define input type
type Input = EditInput<LandingPageUpdateSchema>

// define output type
type Output = ApiResponse<{
    landingPage: LandingPageItem
}>

export function useUpdateLandingPage(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['UpdateLandingPage', businessId],
        mutationFn: async ({id, data}) => {
            const response = await Axios.put(`/api/businesses/${businessId}/landing-pages/${id}`, data);
            return response.data;
        },
        ...props,
    })
}