import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Business} from "@prisma/client";
import type {BusinessCreateSchema} from "@/modules/business/schema/business-schema.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";

// define input type
type Input = BusinessCreateSchema

// define output type
type Output = ApiResponse<{
    business: Business
}>

export function useCreateBusiness(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationFn: async (data) => {
            const response = await Axios.post('/api/businesses', data);
            return response.data;
        },
        ...props,
    })
}
