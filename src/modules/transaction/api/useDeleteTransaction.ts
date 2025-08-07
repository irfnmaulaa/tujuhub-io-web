import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import {useParams} from "react-router-dom";

type Input = {
    id: string;
}

type Output = {
    message: string;
}

export function useDeleteTransaction(opts?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationFn: async ({ id }) => {
            const response = await Axios.delete(`/api/businesses/${businessId}/transactions/${id}`);
            return response.data;
        },
        ...opts,
    })
}