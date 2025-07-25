import useCourses from "@/modules/product/api/useCourses.ts";
import type {ProductItem} from "@/modules/product/types/product-type.ts";
import {useDeleteProduct} from "@/modules/product/api/useDeleteProduct.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import {useUpdateProduct} from "@/modules/product/api/useUpdateProduct.ts";
import type {Key} from "react";
import {toastSuccess} from "@/shared/utils/toast.ts";

type BulkAction = 'delete' | 'publish' | 'set-draft'

export default function useBulkProductAction(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<{ items: ProductItem[]; action: BulkAction; }>({
        title: 'Delete confirmation',
        onConfirm: async ({items, action}) => {

            if (action === 'delete') {
                for (const item of items) {
                    await deleteProduct.mutateAsync({
                        id: item.id,
                    })
                }
            } else if(action === 'publish') {
                for (const item of items) {
                    await updateProduct.mutateAsync({
                        id: item.id,
                        data: {
                            isPublished: true,
                        }
                    })
                }
            } else if(action === 'set-draft') {
                for (const item of items) {
                    await updateProduct.mutateAsync({
                        id: item.id,
                        data: {
                            isPublished: false,
                        }
                    })
                }
            }

            props?.onSuccess?.()
            toastSuccess('Successfully');
            await courses.refetch()
            modal.onClose()

        },
    })

    // define queries
    const courses = useCourses()

    // define mutations
    const deleteProduct = useDeleteProduct()
    const updateProduct = useUpdateProduct()

    return {
        action: (item: { items: ProductItem[]; action: Key; }) => {
            modal.setItem({
                ...item,
                action: item.action as BulkAction
            })
            modal.onOpen()
        },
        ...modal,
    }
}