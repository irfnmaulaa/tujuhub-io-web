import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {Product} from "@prisma/client";
import type {ProductCreateSchema} from "@/modules/product/schema/product-schema.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import {useParams} from "react-router-dom";

// define input type
type Input = ProductCreateSchema

// define output type
type Output = ApiResponse<{
    product: Product
}>

export function useCreateProduct(props?: UseMutationOptions<Input, Output>) {
    const { businessId } = useParams()

    return useMutation<Input, Output>({
        mutationKey: ['CreateProduct', businessId],
        mutationFn: async (data) => {
            const response = await Axios.post(`/api/businesses/${businessId}/products`, data);
            return response.data;
        },
        ...props,
    })
}
