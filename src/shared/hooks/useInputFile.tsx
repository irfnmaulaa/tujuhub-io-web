import {useMemo, useRef, useState} from "react";

export default function useInputFile<D>(params?: {
    accept?: string;
    onChange?: (data: D|null, file: File) => Promise<void>
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [data, setState] = useState<D|null>(null)

    const setData = (data: D) => {
        setState(data)
    }

    const handleFileChanged = async () => {
        if(fileRef.current?.files?.[0]) {
            const file = fileRef.current.files[0]

            if(params?.onChange) {
                await params.onChange(data, file)
            }
        }
    }

    const InputElement = useMemo(() => {
        return (
            <input type="file" className="hidden" accept={params?.accept || '*'} ref={fileRef} onChange={handleFileChanged}/>
        )
    }, [data, params, fileRef])

    const onFocus = () => {
        fileRef.current?.click()
    }

    return {
        InputElement,
        files: fileRef?.current?.files,
        firstFile: fileRef?.current?.files?.[0],
        onFocus,
        data,
        setData,
        fileRef,
    }
}