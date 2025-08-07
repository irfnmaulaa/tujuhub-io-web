import {toastSuccess} from "@/shared/utils/toast.ts"; 
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import {useEffect} from "react";
import type { TransactionItem } from "../types/transaction-type";
import useTransactions from "../api/useTransactions";
import { useDeleteTransaction } from "../api/useDeleteTransaction";

export default function useDeleteTransactionModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<TransactionItem>({
        title: 'Delete confirmation',
        onConfirm: async ({id}) => {
            await deleteTransaction.mutateAsync({id})
        },
    })

    // define queries
    const transactions = useTransactions()

    // define mutations
    const deleteTransaction = useDeleteTransaction({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Transaction deleted successfully')
            await transactions.refetch()
        },
    })

    useEffect(() => {
        if(modal.item?.user?.firstName) {
            modal.setContent(`Are you sure you want to delete transaction for ${modal.item.user.firstName}?`)
        }
    }, [modal.item]);

    return modal
}