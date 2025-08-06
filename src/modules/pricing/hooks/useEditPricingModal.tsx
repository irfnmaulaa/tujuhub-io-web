import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {pricingUpdateSchema, type PricingUpdateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdatePricing} from "@/modules/pricing/api/useUpdatePricing.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import {useEffect, useState} from "react";
import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";
import Form from "@/shared/design-system/form/Form.tsx";
import NumberField from "@/shared/design-system/form/NumberField.tsx";
import { useBundlePricings } from "../api/useBundlePricings";

export default function useEditPricingModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<PricingUpdateSchema>({
        resolver: zodResolver(pricingUpdateSchema)
    })
    const [item, setItem] = useState<PricingItem|null>(null)

    // define queries
    const pricingBundles = useBundlePricings()

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const price = form.watch('price')
    const currency = form.watch('currency')
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
        if(item) {
            await updatePricing.mutateAsync({
                data,
                id: item.id,
            })
        }
    }

    // computed: isPageLoading
    const isPageLoading = updatePricing.isLoading

    useEffect(() => {
        if(item) {
            Object.entries(item).forEach(([key, value]) => {
                form.setValue(key as keyof PricingUpdateSchema, value as any);
            })
            form.setValue('description', item.description || '')
        }
    }, [item]);

    // define element
    const Element = item && (
        <ModalElement
            control={modal}
            header={`Quick edit`}
            footer={<>
                <Button variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Cancel
                </Button>
                <Button type={'submit'} form={'app-form'} isLoading={isPageLoading}>
                    Save
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    label={`Name of ${item.type || 'pricing'}`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={isPageLoading}
                />
                <TextArea
                    label={`Description`}
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={isPageLoading}
                />
                <TextField
                    label="Currency"
                    value={currency}
                    {...form.register('currency')}
                    isInvalid={!!errors.currency}
                    errorMessage={errors.currency?.message}
                    isDisabled={isPageLoading}
                />
                <NumberField
                    label={`Price`}
                    value={price}
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={isPageLoading}
                />
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
        setItem,
        item,
    }
}