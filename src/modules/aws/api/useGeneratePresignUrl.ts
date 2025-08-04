import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import {Axios} from "@/shared/services/api.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import type {GeneratePresignUrlSchema} from "@/modules/aws/schema/aws-schema.ts";

// define input type
type Input = GeneratePresignUrlSchema

// define output type
type Output = ApiResponse<{
    url: string;
    objectUrl: string;
}>

export function useGeneratePresignUrl(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationKey: ['GeneratePresignUrl'],
        mutationFn: async (data) => {
            const response = await Axios.post(`/api/aws/s3/signed-url/generate`, data);
            return response.data;
        },
        ...props,
    })
}
