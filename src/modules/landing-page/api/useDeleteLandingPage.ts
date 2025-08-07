import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {ApiResponse, DeleteInput} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = DeleteInput

// define output type
type Output = ApiResponse

export function useDeleteLandingPage(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['DeleteLandingPage', businessId],
        mutationFn: async ({id}) => {
            const response = await Axios.delete(`/api/businesses/${businessId}/landing-pages/${id}`);
            return response.data;
        },
        ...props,
    })
}