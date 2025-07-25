import { useQuery as useReactQuery, type UseQueryOptions as UseReactQueryOptions } from 'react-query';
import type {AxiosError} from "axios";
import type {ApiError} from "@/shared/types/api-response.ts";

export type UseQueryOptions<Output> = UseReactQueryOptions<Output, AxiosError<ApiError>>

export function useQuery<Output>(
    options: UseQueryOptions<Output>,
) {
    return useReactQuery<Output, AxiosError<ApiError>>({
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}
