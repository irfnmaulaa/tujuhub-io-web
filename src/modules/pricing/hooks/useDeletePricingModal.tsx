import { toastSuccess } from "@/shared/utils/toast.ts";
import type { PricingItem } from "@/modules/pricing/types/pricing-type.ts";
import { useDeletePricing } from "@/modules/pricing/api/useDeletePricing.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import { useEffect } from "react";
import { useBundlePricings } from "../api/useBundlePricings";

export default function useDeletePricingModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<PricingItem>({
        title: 'Delete confirmation',
        onConfirm: async ({id}) => {
            await deletePricing.mutateAsync({id})
        },
    })

    // define queries
    const pricingBundles = useBundlePricings()

    // define mutations
    const deletePricing = useDeletePricing({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Successful')
            await pricingBundles.refetch()
        },
    })

    useEffect(() => {
        if(modal.item.title) {
            modal.setContent(`Are you sure you want to delete ${modal.item.title}?`)
        }
    }, [modal.item]);

    return modal
}