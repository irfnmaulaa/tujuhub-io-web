import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import {useEffect, useState} from "react";
import Form from "@/shared/design-system/form/Form.tsx";
import {Select, SelectItem} from "@heroui/react";
import { transactionUpdateSchema, type TransactionUpdateSchema } from "../schema/transaction-schema";
import type { TransactionItem } from "../types/transaction-type";
import useTransactions from "../api/useTransactions";
import { useUpdateTransaction } from "../api/useUpdateTransaction";

export default function useEditTransactionModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<TransactionUpdateSchema>({
        resolver: zodResolver(transactionUpdateSchema)
    })
    const [item, setItem] = useState<TransactionItem|null>(null)

    // define queries
    const transactions = useTransactions()

    // forms
    const status = form.watch('status')
    const { errors } = form.formState

    // define mutations
    const updateTransaction = useUpdateTransaction({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Transaction updated successfully')
            await transactions.refetch()
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // handle form submission
    const handleSubmit = form.handleSubmit(async (data) => {
        if (!item) return
        
        await updateTransaction.mutateAsync({
            id: item.id,
            data
        })
    })

    // populate form when item changes
    useEffect(() => {
        if (item) {
            form.setValue('status', item.status)
            form.setValue('automationId', item.automationId || '')
        }
    }, [item, form])

    const Element = (
        <ModalElement
            control={modal}
            header={'Edit Transaction'}
            footer={<>
                <Button color={'default'} variant="light" size="lg" isDisabled={updateTransaction.isLoading} onPress={modal.onClose}>Cancel</Button>
                <Button type="submit" color={'primary'} size="lg" isLoading={updateTransaction.isLoading} form="form-update">Update Transaction</Button>
            </>}
        >
            <Form id="form-update" onSubmit={handleSubmit} className={'grid gap-6'}>
                <Select
                    label="Status"
                    selectedKeys={status ? [status] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string
                        form.setValue('status', selectedKey as 'pending' | 'completed' | 'expired')
                    }}
                    isInvalid={!!errors.status}
                    errorMessage={errors.status?.message}
                    isDisabled={updateTransaction.isLoading}
                >
                    <SelectItem key="pending">Pending</SelectItem>
                    <SelectItem key="completed">Completed</SelectItem>
                    <SelectItem key="expired">Expired</SelectItem>
                </Select>
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
        setItem,
        item
    }
}