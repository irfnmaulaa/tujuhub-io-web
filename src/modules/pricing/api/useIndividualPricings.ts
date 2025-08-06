import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams, useSearchParams} from "react-router-dom";
import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";

// define output type
type Output = PaginationResponse<PricingItem[]>

type UseIndividualPricingsOptions = {
    search?: string;
} & UseQueryOptions<Output>;

// Individual pricing items hook with type='individual' filter
export function useIndividualPricings(opts?: UseIndividualPricingsOptions) {
    const { businessId } = useParams()
    const [query] = useSearchParams()
    
    const params: Record<string, any> = {
        type: 'individual',
        ...Object.fromEntries(query),
    }
    
    if (opts?.search) {
        params.search = opts.search
    }

    return useQuery<Output>({
        queryKey: ['IndividualPricings', businessId, params],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/pricings`, {
                params,
            });
            return response.data.data.pricings;
        },
        retry: false,
        ...opts,
    })
}