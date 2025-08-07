import {toastSuccess} from "@/shared/utils/toast.ts";
import useLandingPages from "@/modules/landing-page/api/useLandingPages.ts";
import type {LandingPageItem} from "@/modules/landing-page/types/landing-page-types.ts";
import {useDeleteLandingPage} from "@/modules/landing-page/api/useDeleteLandingPage.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import {useEffect} from "react";

export default function useDeleteLandingPageModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<LandingPageItem>({
        title: 'Delete confirmation',
        onConfirm: async ({id}) => {
            await deleteLandingPage.mutateAsync({id})
        },
    })

    // define queries
    const landingPages = useLandingPages()

    // define mutations
    const deleteLandingPage = useDeleteLandingPage({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Landing page deleted successfully')
            await landingPages.refetch()
        },
    })

    useEffect(() => {
        if(modal.item.title) {
            modal.setContent(`Are you sure you want to delete "${modal.item.title}"?`)
        }
    }, [modal.item]);

    return modal
}