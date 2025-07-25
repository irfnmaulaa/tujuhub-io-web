import {toastSuccess} from "@/shared/utils/toast.ts";
import useCourses from "@/modules/product/api/useCourses.ts";
import type {ProductItem} from "@/modules/product/types/product-type.ts";
import {useDeleteProduct} from "@/modules/product/api/useDeleteProduct.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import {useEffect} from "react";

export default function useDeleteProductModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<ProductItem>({
        title: 'Delete confirmation',
        onConfirm: async ({id}) => {
            await deleteProduct.mutateAsync({id})
        },
    })

    // define queries
    const courses = useCourses()

    // define mutations
    const deleteProduct = useDeleteProduct({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Successful')

            if(modal.item.productType === 'course') {
                await courses.refetch()
            }
        },
    })

    useEffect(() => {
        if(modal.item.title) {
            modal.setContent(`Are you sure you want to delete ${modal.item.title}?`)
        }
    }, [modal.item]);

    return modal
}