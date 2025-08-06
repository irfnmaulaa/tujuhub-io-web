import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {Axios} from "@/shared/services/api.ts";
import type {RegisterSchema} from "@/modules/auth/schema/auth-schema.ts";

// define input type
type Input = RegisterSchema

// define output type
type Output = ApiResponse<{
    token: string;
}>

export function useRegister(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationFn: async (data) => {
            const response = await Axios.post('/api/auth/register', data);
            return response.data;
        },
        ...props,
    })
}
