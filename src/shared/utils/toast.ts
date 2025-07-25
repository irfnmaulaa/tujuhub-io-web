import {addToast, closeAll} from "@heroui/toast";

export const toastSuccess = (message: string, options?: {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return addToast({
        title: message,
        color: 'success',
        variant: 'solid',

    })
}

export const toastInfo = (message: string, options?: {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return addToast({
        title: message,
        color: 'secondary',
        variant: 'solid'
    })
}


export const toastError = (message: string, options?: {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return addToast({
        title: message,
        color: 'danger',
        variant: 'solid'
    })
}

export const toastDismiss = () => {
    closeAll()
}