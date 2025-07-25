import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Business} from "@prisma/client";

// define output type
type Output = {items: Business[]}

export default function useBusinesses(opts?: UseQueryOptions<Output>) {
    return useQuery<Output>({
        queryKey: ['Businesses'],
        queryFn: async (data) => {
            const response = await Axios.get('/api/businesses', data);
            return response.data.data.businesses;
        },
        retry: false,
        ...opts,
    })
}