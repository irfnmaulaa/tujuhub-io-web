import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import {useParams} from "react-router-dom";
import type {TransactionUpdateSchema} from "@/modules/transaction/schema/transaction-schema.ts";
import type {TransactionItem} from "@/modules/transaction/types/transaction-type.ts";

type Input = {
    id: string;
    data: TransactionUpdateSchema;
}

type Output = {
    message: string;
    data: {
        transaction: TransactionItem;
    }
}

export function useUpdateTransaction(opts?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationFn: async ({ id, data }) => {
            const response = await Axios.put(`/api/businesses/${businessId}/transactions/${id}`, data);
            return response.data;
        },
        ...opts,
    })
}