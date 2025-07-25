import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {User} from "@prisma/client";

// define output type
type Output = User

export default function useProfile(opts?: UseQueryOptions<Output>) {
    return useQuery<Output>({
        queryKey: ['Profile'],
        queryFn: async (data) => {
            const response = await Axios.get('/api/profile', data);
            return response.data.data.user;
        },
        retry: false,
        ...opts,
    })
}