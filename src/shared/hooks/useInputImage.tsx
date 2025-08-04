import useInputFile from "@/shared/hooks/useInputFile.tsx";
import {useState} from "react";

export default function useInputImage<D>(params?: {
    onChange?: (data: D|null, file: File) => Promise<void>
}) {
    const [preview, setPreview] = useState<string>();

    const inputFile = useInputFile({
        ...params,
        accept: 'image/*',
        onChange: async (_, file) => {
            setPreview(URL.createObjectURL(file))
        }
    })

    const reset = () => {
        setPreview('')
        if(inputFile.fileRef.current) {
            inputFile.fileRef.current.value = ''
        }
    }

    return {
        ...inputFile,
        preview,
        setPreview,
        reset,
    }
}