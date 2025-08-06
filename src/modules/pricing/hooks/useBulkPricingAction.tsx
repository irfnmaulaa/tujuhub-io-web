import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";
import {useDeletePricing} from "@/modules/pricing/api/useDeletePricing.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import type {Key} from "react";
import {toastSuccess} from "@/shared/utils/toast.ts";
import { useBundlePricings } from "../api/useBundlePricings";

type BulkAction = 'delete' | 'activate' | 'deactivate'

export default function useBulkPricingAction(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<{ items: PricingItem[]; action: BulkAction; }>({
        title: 'Bulk action confirmation',
        onConfirm: async ({items, action}) => {

            if (action === 'delete') {
                for (const item of items) {
                    await deletePricing.mutateAsync({
                        id: item.id,
                    })
                }
            }
            // Note: activate/deactivate actions would need updatePricing implementation
            // when isActive field is available in the pricing schema

            props?.onSuccess?.()
            toastSuccess('Successfully');
            await pricingBundles.refetch()
            modal.onClose()

        },
    })

    // define queries
    const pricingBundles = useBundlePricings()

    // define mutations
    const deletePricing = useDeletePricing()

    return {
        action: (item: { items: PricingItem[]; action: Key; }) => {
            modal.setItem({
                ...item,
                action: item.action as BulkAction
            })
            modal.onOpen()
        },
        ...modal,
    }
}