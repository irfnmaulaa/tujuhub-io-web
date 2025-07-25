import {type JSX, useMemo, useState} from "react";
import {useDisclosure, type UseDisclosureProps} from "@heroui/react";
import {ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";

export default function useConfirmation<D>({ title: initialTitle = 'Confirmation', color = 'danger', onConfirm, data: initialItem = '' as D }: {
    onConfirm: (data: D) => Promise<void>;
    data?: D;
    color?: 'danger' | 'primary' | 'success' | 'warning';
    title?: string;
}) {

    // define state
    const disclosure = useDisclosure()
    const [title, setTitle] = useState<string>(initialTitle)
    const [content, setContent] = useState<string|JSX.Element>()
    const [item, setItem] = useState<D>(initialItem)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // define modal element
    const Element = useMemo(() => {
        return <ConfirmationModal
            color={color}
            title={title}
            content={content}
            onConfirm={async () => {
                setIsLoading(true)
                await onConfirm(item)
                setIsLoading(false)
            }}
            isLoading={isLoading}
            {...disclosure}/>
    }, [disclosure])

    return {
        ...disclosure,
        Element,
        setTitle,
        setContent,
        item,
        setItem,
        isLoading
    }

}

function ConfirmationModal({content, title, onConfirm, isLoading, color, ...props}: UseDisclosureProps & {
    title?: string;
    content?: string | JSX.Element;
    onConfirm?: () => void
    isLoading?: boolean;
    color?: 'danger' | 'primary' | 'success' | 'warning';
}) {
    return (
        <ModalElement
            control={props}
            footer={<>
                <Button color={'default'} variant="light" size="lg" isDisabled={isLoading} onPress={props.onClose}>Cancel</Button>
                <Button color={color || 'danger'} size="lg" isLoading={isLoading} onPress={onConfirm}>Confirm</Button>
            </>}
            header={title}
        >
            <div className="mt-2">
                {content || 'Are you sure to process this action?'}
            </div>
        </ModalElement>
    )
}