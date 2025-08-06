import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams, useSearchParams} from "react-router-dom";
import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";

// define output type
type Output = PaginationResponse<PricingItem[]>

type UsePricingsOptions = {
    type?: string;
    search?: string;
} & UseQueryOptions<Output>;

// General pricing hook
export default function usePricings(opts?: UsePricingsOptions) {
    const { businessId } = useParams()
    const [query] = useSearchParams()
    
    // Build params object with optional type and search filters
    const params: Record<string, any> = {}
    if (opts?.type) {
        params.type = opts.type
    }
    if (opts?.search) {
        params.search = opts.search
    }
    
    const queryString = query.toString()

    return useQuery<Output>({
        queryKey: ['Pricings', businessId, queryString, opts?.type, opts?.search],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/pricings?${queryString}`, {
                params,
            });
            return response.data.data.pricings;
        },
        retry: false,
        ...opts,
    })
} 