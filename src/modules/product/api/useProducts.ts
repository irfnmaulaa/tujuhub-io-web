import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";
import type {ProductItem} from "@/modules/product/types/product-type.ts";

// define output type
type Output = PaginationResponse<ProductItem[]>

type UseProductsOptions = {
    search?: string;
} & UseQueryOptions<Output>

export default function useProducts(opts?: UseProductsOptions) {
    const { businessId } = useParams()
    const { search, ...queryOptions } = opts || {}
    
    const params = new URLSearchParams()
    if (search) {
        params.append('search', search)
    }
    const queryString = params.toString()

    return useQuery<Output>({
        queryKey: ['AllProducts', businessId, queryString],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/products?${queryString}`);
            return response.data.data.products;
        },
        retry: false,
        ...queryOptions,
    })
}