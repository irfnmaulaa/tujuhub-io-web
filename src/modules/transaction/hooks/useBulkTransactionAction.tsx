import useTransactions from "@/modules/transaction/api/useTransactions.ts";
import type {TransactionItem} from "@/modules/transaction/types/transaction-type.ts";
import {useDeleteTransaction} from "@/modules/transaction/api/useDeleteTransaction.ts";
import useConfirmation from "@/shared/hooks/useConfirmation.tsx";
import {useUpdateTransaction} from "@/modules/transaction/api/useUpdateTransaction.ts";
import type {Key} from "react";
import {toastSuccess} from "@/shared/utils/toast.ts";

type BulkAction = 'delete' | 'mark-completed' | 'mark-pending' | 'mark-expired'

export default function useBulkTransactionAction(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useConfirmation<{ items: TransactionItem[]; action: BulkAction; }>({
        title: 'Bulk Action Confirmation',
        onConfirm: async ({items, action}) => {

            if (action === 'delete') {
                for (const item of items) {
                    await deleteTransaction.mutateAsync({
                        id: item.id,
                    })
                }
            } else if(action === 'mark-completed') {
                for (const item of items) {
                    await updateTransaction.mutateAsync({
                        id: item.id,
                        data: {
                            status: 'completed',
                        }
                    })
                }
            } else if(action === 'mark-pending') {
                for (const item of items) {
                    await updateTransaction.mutateAsync({
                        id: item.id,
                        data: {
                            status: 'pending',
                        }
                    })
                }
            } else if(action === 'mark-expired') {
                for (const item of items) {
                    await updateTransaction.mutateAsync({
                        id: item.id,
                        data: {
                            status: 'expired',
                        }
                    })
                }
            }

            props?.onSuccess?.()
            toastSuccess('Bulk action completed successfully');
            await transactions.refetch()
            modal.onClose()

        },
    })

    // define queries
    const transactions = useTransactions()

    // define mutations
    const deleteTransaction = useDeleteTransaction()
    const updateTransaction = useUpdateTransaction()

    return {
        action: (item: { items: TransactionItem[]; action: Key; }) => {
            modal.setItem({
                ...item,
                action: item.action as BulkAction
            })
            modal.onOpen()
        },
        ...modal,
    }
}