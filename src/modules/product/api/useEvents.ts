import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams, useSearchParams} from "react-router-dom";
import type {ProductItem} from "@/modules/product/types/product-type.ts";

// define output type
type Output = PaginationResponse<ProductItem[]>

export default function useEvents(opts?: UseQueryOptions<Output>) {

    const { businessId } = useParams()
    const params = {
        productType: 'event'
    }
    const [query] = useSearchParams()
    const queryString = query.toString()

    return useQuery<Output>({
        queryKey: ['Events', businessId, queryString],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/products?${queryString}`, {
                params,
            });
            return response.data.data.products;
        },
        retry: false,
        ...opts,
    })
}