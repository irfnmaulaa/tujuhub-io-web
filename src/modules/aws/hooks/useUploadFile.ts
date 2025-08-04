import {toastError} from "@/shared/utils/toast.ts";
import {v4 as uuid} from "uuid"
import {useState} from "react";
import {useGeneratePresignUrl} from "@/modules/aws/api/useGeneratePresignUrl.ts";
import {usePutObject} from "@/modules/aws/api/usePutObject.ts";
import useProfile from "@/modules/profile/api/useProfile.ts";

const useUploadFile = () => {
    // generate S3 sign url
    const generateSignUrl = useGeneratePresignUrl()
    const putObject = usePutObject()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const profile = useProfile()

    return {
        put: async ({ file, path, uniqueName = null, isPrivateBucket = false, isUniqueFileName = false }: {
            file: File;
            path?: string;
            uniqueName?: string | null;
            isUniqueFileName?: boolean;
            isPrivateBucket?: boolean;
        }) => {
            setIsLoading(true)
            try {
                const name = (uniqueName?.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase() || uuid()) + (!isUniqueFileName ?  `.${getFileExtension(file.name)}` : '')


                const fileName = (path || profile.data?.email || 'files') + '/' + name

                const response = await generateSignUrl.mutateAsync({
                    fileName,
                    type: 'put',
                    isPrivateBucket
                })

                if(response?.data?.url) {
                    await putObject.mutateAsync({
                        signedUrl: response.data.url,
                        file,
                    })
                }

                setIsLoading(false)
                return response?.data?.objectUrl || ''
            } catch(err) {
                console.log(err)
                toastError('Ops, something went wrong')

                setIsLoading(false)
                return ''
            }
        },
        isLoading,
    }
}

export function getFileExtension(filename: string) {
    return filename.split('.').pop();
}

export default useUploadFile