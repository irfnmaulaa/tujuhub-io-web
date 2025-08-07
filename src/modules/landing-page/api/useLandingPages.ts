import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams, useSearchParams} from "react-router-dom";
import type {LandingPageItem} from "@/modules/landing-page/types/landing-page-types.ts";

// define output type
type Output = PaginationResponse<LandingPageItem[]>

type UseLandingPagesOptions = {
    search?: string;
} & UseQueryOptions<Output>;

export default function useLandingPages(opts?: UseLandingPagesOptions) {
    const { businessId } = useParams()
    const [query] = useSearchParams()
    
    const params: Record<string, any> = {}
    if (opts?.search) {
        params.search = opts.search
    }
    
    const queryString = query.toString()

    return useQuery<Output>({
        queryKey: ['LandingPages', businessId, queryString, opts?.search],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/landing-pages?${queryString}`, {
                params,
            });
            return response.data.data.landingPages;
        },
        retry: false,
        ...opts,
    })
}