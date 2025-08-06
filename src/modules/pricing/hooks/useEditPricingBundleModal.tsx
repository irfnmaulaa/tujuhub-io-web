import { useModal, ModalElement } from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import { useForm } from "react-hook-form";
import { pricingUpdateSchema, type PricingUpdateSchema } from "@/modules/pricing/schema/pricing-schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePricing } from "@/modules/pricing/api/useUpdatePricing.ts";
import { setFormError } from "@/shared/utils/error.ts";
import { toastSuccess } from "@/shared/utils/toast.ts";
import NumberField from "@/shared/design-system/form/NumberField.tsx";
import Form from "@/shared/design-system/form/Form.tsx";
import { useEffect, useState } from "react";
import { type PricingItem } from "@/modules/pricing/types/pricing-type.ts";
import { useBundlePricings } from "../api/useBundlePricings";

export default function useEditPricingBundleModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const [item, setItem] = useState<PricingItem | null>(null)
    
    // Default currency - easily configurable for future support
    const DEFAULT_CURRENCY = 'IDR'
    
    const form = useForm<PricingUpdateSchema>({
        resolver: zodResolver(pricingUpdateSchema),
        defaultValues: {
            currency: DEFAULT_CURRENCY
        }
    })

    // define queries
    const pricingBundles = useBundlePricings()

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const price = form.watch('price')
    const { errors } = form.formState

    // define mutations
    const updatePricing = useUpdatePricing({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Successful')
            await pricingBundles.refetch()
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define actions: onSubmit
    const onSubmit = async (data: PricingUpdateSchema) => {
        if (!item) return
        // Ensure currency is set to default
        const updateData = {
            ...data,
            currency: DEFAULT_CURRENCY
        }
        await updatePricing.mutateAsync({
            id: item.id,
            data: updateData
        })
    }

    // populate form when item changes
    useEffect(() => {
        if (item) {
            form.reset({
                title: item.title,
                description: item.description || '',
                currency: DEFAULT_CURRENCY, // Default currency since not in PricingItem
                price: item.price
            })
        }
    }, [item, form])

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header={`Edit bundle`}
            footer={<>
                <Button variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Close
                </Button>
                <Button type={'submit'} form={'app-form'} isLoading={updatePricing.isLoading}>
                    Update
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    label={`Bundle name`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={updatePricing.isLoading}
                />
                <TextArea
                    label={`Description`}
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={updatePricing.isLoading}
                />
                {/* Currency field removed - currently only supports IDR */}
                {/* TODO: Add currency selector when multiple currencies are supported */}
                <NumberField
                    label={`Price`}
                    value={price}
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={updatePricing.isLoading}
                />
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
        item,
        setItem
    }
}