import {useMutation, type UseMutationOptions} from "@/shared/hooks/useMutation.ts";
import type {ApiResponse} from "@/shared/types/api-response.ts";
import type {PutObjectSchema} from "@/modules/aws/schema/aws-schema.ts";
import axios from "axios";

// define input type
type Input = PutObjectSchema

// define output type
type Output = ApiResponse

export function usePutObject(props?: UseMutationOptions<Input, Output>) {
    return useMutation<Input, Output>({
        mutationKey: ['PutObject'],
        mutationFn: async (data) => {
            const stream = await getFileStream(data.file)
            const response = await axios.put(data.signedUrl, stream, {
                headers: {
                    'Content-type': data.file.type,
                }
            });
            return response.data;
        },
        ...props,
    })
}

export const getFileStream = async (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target) {
                resolve(e.target.result)
            }
        }
        reader.onerror = () => {
            reject(false)
        }
        reader.readAsArrayBuffer(file)
    })
}
