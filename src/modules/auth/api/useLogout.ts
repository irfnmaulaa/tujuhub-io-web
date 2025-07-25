import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {Axios} from "@/shared/services/api.ts";

// define input type
type Input = {}

// define output type
type Output = ApiResponse<{  }>

export function useLogout(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationFn: async (data) => {
            const response = await Axios.get('/api/auth/logout', data);
            return response.data;
        },
        ...props,
    })
}
