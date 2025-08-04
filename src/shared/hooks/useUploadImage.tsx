import Card from "@/shared/design-system/card/Card.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import useInputImage from "@/shared/hooks/useInputImage.tsx";
import {TbEdit, TbTrash} from "react-icons/tb";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";

export default function useUploadImage(params?: {
    info?: string;
    label?: string;
}) {

    // define hooks
    const inputFile = useInputImage()
    const confirm = useConfirmation({
        onConfirm: async () => {
            if(inputFile.fileRef.current) {
                inputFile.fileRef.current.value = ''
            }
            inputFile.setPreview('')
            confirm.onClose()
        }
    })

    // define element
    const Element = (
        <div className="grid grid-cols-2 w-full gap-4">
            <div className={'w-full'}>
                <Card onPress={() => {
                    inputFile.onFocus()
                }} isPressable={!inputFile.preview} className={'aspect-[3/2] relative text-default-600 w-full border-2 rounded-xl bg-default-100 border-dashed border-default flex items-center justify-center text-center'}>
                    { inputFile.preview ? (
                        <>
                            <img src={inputFile.preview} alt="image" className={'w-full h-full object-contain object-center'}/>
                            {inputFile.firstFile && (
                                <div className={'absolute right-2 top-2 flex items-center gap-1'}>
                                    <Button variant={'faded'} color={'danger'} onPress={() => {
                                        confirm.onOpen()
                                    }} isIconOnly radius={'full'}>
                                        <TbTrash className={'size-6'}/>
                                    </Button>
                                    <Button variant={'faded'} color={'default'} onPress={() => {
                                        inputFile.onFocus()
                                    }} isIconOnly radius={'full'}>
                                        <TbEdit className={'size-6'}/>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Upload</p>
                    ) }
                </Card>
            </div>
            <div className={'py-1'}>
                <div className="mb-5 flex flex-col gap-1">
                    <div className={'font-semibold'}>{params?.label || 'Image'}</div>
                    {params?.info && (
                        <div className={'text-sm text-default-500'}>{params?.info}</div>
                    )}
                </div>
            </div>
            {inputFile.InputElement}
            {confirm.Element}
        </div>
    )

    return {
        ...inputFile,
        Element,
    }
}