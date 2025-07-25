import toast, {type ToastOptions} from "react-hot-toast";

const toastConfig: Partial<ToastOptions> = {
    position: 'top-center'
}

export const toastLoading = (message: string, options?: ToastOptions & {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return toast.loading(message, { ...toastConfig, ...options })
}

export const toastSuccess = (message: string, options?: ToastOptions & {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return toast.success(message, { ...toastConfig, ...options })
}

export const toastInfo = (message: string, options?: ToastOptions & {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return toast(message, {
        icon: 'ℹ️',
        ...toastConfig,
        ...options,
    })
}


export const toastError = (message: string, options?: ToastOptions & {dismissBefore: boolean}) => {
    if(options?.dismissBefore) {
        toastDismiss()
    }
    return toast.error(message, { ...toastConfig, ...options })
}

export const toastDismiss = (toastId?: string) => {
    return toast.dismiss(toastId)
}