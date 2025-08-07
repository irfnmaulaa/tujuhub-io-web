import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import {useParams} from "react-router-dom";
import type {TransactionCreateSchema} from "@/modules/transaction/schema/transaction-schema.ts";
import type {TransactionItem} from "@/modules/transaction/types/transaction-type.ts";

type Input = {
    data: TransactionCreateSchema;
}

type Output = {
    message: string;
    data: {
        transaction: TransactionItem;
        
    }
}

export function useCreateTransaction(opts?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationFn: async ({ data }) => {
            const response = await Axios.post(`/api/businesses/${businessId}/transactions`, data);
            return response.data;
        },
        ...opts,
    })
}