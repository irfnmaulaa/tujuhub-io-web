import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import {useForm} from "react-hook-form";
import {type TransactionCreateSchema, transactionCreateSchema} from "@/modules/transaction/schema/transaction-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateTransaction} from "@/modules/transaction/api/useCreateTransaction.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useTransactions from "@/modules/transaction/api/useTransactions.ts";
import Form from "@/shared/design-system/form/Form.tsx";
import {Select, SelectItem, Switch} from "@heroui/react";
import MultiSelectAutocomplete, { type Option } from "@/shared/design-system/form/MultiSelectAutocomplete.tsx";
import {useState, useCallback, useEffect} from "react";
import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";
import usePricings from "@/modules/pricing/api/usePricings";

export default function useAddTransactionModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<TransactionCreateSchema>({
        resolver: zodResolver(transactionCreateSchema)
    })
    const [selectedPricings, setSelectedPricings] = useState<PricingItem[]>([])

    // define queries
    const transactions = useTransactions()
    const pricings = usePricings()

    // forms
    const userFullName = form.watch('userFullName')
    const userEmail = form.watch('userEmail')
    const userPhone = form.watch('userPhone')
    const provider = form.watch('provider')
    const status = form.watch('status')
    const { errors } = form.formState

    // define mutations
    const createTransaction = useCreateTransaction({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Transaction created successfully')
            await transactions.refetch()
            form.reset()
            setSelectedPricings([])
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // handle form submission
    const handleSubmit = form.handleSubmit(async (data) => {
        const transactionPricings = selectedPricings.map(pricing => ({
            pricingId: pricing.id,
            quantity: 1
        }))

        await createTransaction.mutateAsync({
            data: {
                ...data,
                transactionPricings
            }
        })
    })

    // pricing options for autocomplete
    const loadPricingOptions = useCallback(async (inputValue: string): Promise<Option[]> => {
        if (!pricings.data?.items) return []
        
        return pricings.data.items
            .filter(pricing => 
                pricing.title.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map(pricing => ({
                value: pricing.id,
                label: `${pricing.title} - ${new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: pricing.currency || 'IDR',
                    minimumFractionDigits: 0
                }).format(pricing.price)}`,
                data: pricing
            }))
    }, [pricings.data?.items])

    const handlePricingChange = useCallback((options: Option[]) => {
        const pricingItems = options.map(option => option.data as PricingItem)
        setSelectedPricings(pricingItems)
    }, []) 

    useEffect(() => {
        form.setValue('transactionPricings', selectedPricings.map(pricing => ({
            pricingId: pricing.id,
            quantity: 1,
        })))
    }, [selectedPricings])

    console.log(form.formState.errors)

    const Element = (
        <ModalElement
            control={modal}
            header={'Add Transaction'}
            footer={<>
                <Button color={'default'} variant="light" size="lg" isDisabled={createTransaction.isLoading} onPress={modal.onClose}>Cancel</Button>
                <Button type="submit" color={'primary'} size="lg" isLoading={createTransaction.isLoading} form="form-create">Create Transaction</Button>
            </>}
        >
            <Form id="form-create" className={'grid gap-6'} onSubmit={handleSubmit}>
                <TextField
                    label={'Customer Full Name'}
                    value={userFullName || ''}
                    onValueChange={(value) => form.setValue('userFullName', value)}
                    isInvalid={!!errors.userFullName}
                    errorMessage={errors.userFullName?.message}
                    isDisabled={createTransaction.isLoading}
                />
                
                <TextField
                    label={'Customer Email'}
                    type="email"
                    value={userEmail || ''}
                    onValueChange={(value) => form.setValue('userEmail', value)}
                    isInvalid={!!errors.userEmail}
                    errorMessage={errors.userEmail?.message}
                    isDisabled={createTransaction.isLoading}
                />
                
                <TextField
                    label={'Customer Phone'}
                    value={userPhone || ''}
                    onValueChange={(value) => form.setValue('userPhone', value)}
                    isInvalid={!!errors.userPhone}
                    errorMessage={errors.userPhone?.message}
                    isDisabled={createTransaction.isLoading}
                />

                <Select
                    label="Provider"
                    selectedKeys={provider ? [provider] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string
                        form.setValue('provider', selectedKey as 'xendit' | 'manual')
                    }}
                    isInvalid={!!errors.provider}
                    errorMessage={errors.provider?.message}
                    isDisabled={createTransaction.isLoading}
                >
                    <SelectItem key="xendit">Xendit</SelectItem>
                    <SelectItem key="manual">Manual</SelectItem>
                </Select>

                <Select
                    label="Status"
                    selectedKeys={status ? [status] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string
                        form.setValue('status', selectedKey as 'pending' | 'completed' | 'expired')
                    }}
                    isInvalid={!!errors.status}
                    errorMessage={errors.status?.message}
                    isDisabled={createTransaction.isLoading}
                >
                    <SelectItem key="pending">Pending</SelectItem>
                    <SelectItem key="completed">Completed</SelectItem>
                    <SelectItem key="expired">Expired</SelectItem>
                </Select>

                <MultiSelectAutocomplete
                    label="Select Products/Pricings"
                    onSearch={loadPricingOptions}
                    onChange={handlePricingChange}
                    value={selectedPricings.map(pricing => ({
                        value: pricing.id,
                        label: `${pricing.title} - ${new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: pricing.currency || 'IDR',
                            minimumFractionDigits: 0
                        }).format(pricing.price)}`,
                        data: pricing
                    }))}
                    isDisabled={createTransaction.isLoading}
                    placeholder="Search and select products..."
                />

                <Switch 
                    isDisabled={createTransaction.isLoading}
                    isSelected={form.watch('generateInvoice')}
                    onValueChange={(checked) => form.setValue('generateInvoice', checked)}
                >
                    Generate Payment Invoice
                </Switch>
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
    }
}