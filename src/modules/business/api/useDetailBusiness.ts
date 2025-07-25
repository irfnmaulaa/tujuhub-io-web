import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Business} from "@prisma/client";
import {useParams} from "react-router-dom";

// define output type
type Output = Business

export function useDetailBusiness(opts?: UseQueryOptions<Output>) {

    // define hooks
    const {businessId} = useParams()

    return useQuery<Output>({
        queryKey: ['DetailBusiness', businessId],
        queryFn: async (data) => {
            const response = await Axios.get(`/api/businesses/${businessId}`, data);
            return response.data.data.business;
        },
        retry: false,
        ...opts,
    })
}