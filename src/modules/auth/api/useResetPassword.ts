import { useMutation, type UseMutationOptions } from "@/shared/hooks/useMutation.ts";
import type { ApiResponse } from "@/shared/types/api-response.ts";
import { Axios } from "@/shared/services/api.ts";
import type { ResetPasswordSchema } from "../schema/auth-schema";

// define input type
type Input = ResetPasswordSchema

// define output type
type Output = ApiResponse

export function useResetPassword(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationFn: async (data) => {
            const response = await Axios.post('/api/auth/reset-password', data);
            return response.data;
        },
        ...props,
    })
}
