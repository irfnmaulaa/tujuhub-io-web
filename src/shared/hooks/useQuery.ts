import { useQuery as useReactQuery, type UseQueryOptions as UseReactQueryOptions } from 'react-query';
import type {AxiosError} from "axios";

type ApiError = {
    status: string;
    message: string;
}

export type UseQueryOptions<Output> = UseReactQueryOptions<Output, AxiosError<ApiError>>

export function useQuery<Output>(
    options: UseQueryOptions<Output>,
) {
    return useReactQuery<Output, AxiosError<ApiError>>({
        ...options,
    });
}
