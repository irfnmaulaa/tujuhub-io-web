import {useQuery, type UseQueryOptions} from "@/shared/hooks/useQuery.ts";
import {Axios} from "@/shared/services/api.ts";
import type {PaginationResponse} from "@/shared/types/api-response.ts";
import {useParams, useSearchParams} from "react-router-dom";
import type {TransactionItem} from "@/modules/transaction/types/transaction-type.ts";

// define output type
type Output = PaginationResponse<TransactionItem[]>

export default function useTransactions(opts?: UseQueryOptions<Output>) {
    const { businessId } = useParams()
    const [query] = useSearchParams()
    const queryString = query.toString()

    return useQuery<Output>({
        queryKey: ['Transactions', businessId, queryString],
        queryFn: async () => {
            const response = await Axios.get(`/api/businesses/${businessId}/transactions?${queryString}`);
            return response.data.data.transactions;
        },
        retry: false,
        ...opts,
    })
}