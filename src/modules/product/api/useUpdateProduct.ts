import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Product} from "@prisma/client";
import type {ProductUpdateSchema} from "@/modules/product/schema/product-schema.ts";
import type {ApiResponse, EditInput} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = EditInput<ProductUpdateSchema>

// define output type
type Output = ApiResponse<{
    product: Product
}>

export function useUpdateProduct(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['UpdateProduct', businessId],
        mutationFn: async ({id, data}) => {
            const response = await Axios.put(`/api/businesses/${businessId}/products/${id}`, data);
            return response.data;
        },
        ...props,
    })
}
