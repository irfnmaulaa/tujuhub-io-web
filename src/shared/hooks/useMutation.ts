import { useMutation as useReactMutation, type UseMutationOptions as UseReactMutationOptions } from 'react-query';
import type {AxiosError} from "axios";
import {toastError} from "@/shared/utils/toast.ts";
import type {ApiError} from "@/shared/types/api-response.ts";

export type UseMutationOptions<Input, Output> = UseReactMutationOptions<Output, AxiosError<ApiError>, Input>

export function useMutation<Input, Output>(
    options: UseMutationOptions<Input, Output>,
) {
    return useReactMutation<Output, AxiosError<ApiError>, Input>({
        ...options,
        onError: async (...error) => {
            const data = error[0].response?.data
            toastError(`${data?.status.toUpperCase() }: ${data?.message||'Something gone wrong, please try again!'}`, {dismissBefore: true})
            await options?.onError?.(...error)
        }
    });
}
