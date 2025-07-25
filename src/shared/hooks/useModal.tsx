import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, type ModalProps,
    useDisclosure,
    type UseDisclosureProps
} from "@heroui/react";
import type {JSX, PropsWithChildren} from "react";

export function ModalElement({ control, header, footer, children, ...props }: PropsWithChildren & ModalProps & {
    header?: JSX.Element | string;
    footer?: JSX.Element | string;
    control: UseDisclosureProps;
}) {
    return (
        <Modal
            size={'lg'}
            isOpen={control.isOpen}
            onClose={control.onClose}
            hideCloseButton
            placement={'top'}
            scrollBehavior={'inside'}
            {...props}
        >
            <ModalContent>
                {header && (
                    <ModalHeader>
                        {header}
                    </ModalHeader>
                )}
                <ModalBody>
                    {children}
                </ModalBody>
                {footer && (
                    <ModalFooter>
                        {footer}
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    )
}

export function useModal() {
    return useDisclosure()
}