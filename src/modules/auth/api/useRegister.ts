import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {Axios} from "@/shared/services/api.ts";
import type {LoginSchema} from "@/modules/auth/schema/auth-schema.ts";

// define input type
type Input = LoginSchema

// define output type
type Output = ApiResponse<{
    token: string;
}>

export function useLogin(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationFn: async (data) => {
            const response = await Axios.post('/api/auth/login', data);
            return response.data;
        },
        ...props,
    })
}
