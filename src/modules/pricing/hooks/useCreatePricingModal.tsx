import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {pricingCreateSchema, type PricingCreateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreatePricing} from "@/modules/pricing/api/useCreatePricing.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import {usePricingBundles} from "@/modules/pricing/api/usePricings.ts";
import NumberField from "@/shared/design-system/form/NumberField.tsx";
import Form from "@/shared/design-system/form/Form.tsx";
import {Select, SelectItem} from "@heroui/react";

export default function useCreatePricingModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<PricingCreateSchema>({
        resolver: zodResolver(pricingCreateSchema),
        defaultValues: {
            type: 'bundle',
            currency: 'IDR'
        }
    })

    // define queries
    const pricingBundles = usePricingBundles()

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const price = form.watch('price')
    const currency = form.watch('currency')
    const type = form.watch('type')
    const { errors } = form.formState

    // define mutations
    const createPricing = useCreatePricing({
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
    const onSubmit = async (data: PricingCreateSchema) => {
        await createPricing.mutateAsync(data)
    }

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header={`Create new ${type}`}
            footer={<>
                <Button variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Close
                </Button>
                <Button type={'submit'} form={'app-form'} isLoading={createPricing.isLoading}>
                    Create
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    label={`Name of ${type || 'pricing'}`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={createPricing.isLoading}
                />
                <TextArea
                    label={`Description`}
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={createPricing.isLoading}
                />
                <Select
                    label="Type"
                    selectedKeys={type ? [type] : []}
                    onSelectionChange={(keys) => {
                        const selectedType = Array.from(keys)[0] as string
                        form.setValue('type', selectedType as 'individual' | 'bundle')
                    }}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type?.message}
                    isDisabled={createPricing.isLoading}
                >
                    <SelectItem key="individual">
                        Individual
                    </SelectItem>
                    <SelectItem key="bundle">
                        Bundle
                    </SelectItem>
                </Select>
                <TextField
                    label="Currency"
                    value={currency}
                    {...form.register('currency')}
                    isInvalid={!!errors.currency}
                    errorMessage={errors.currency?.message}
                    isDisabled={createPricing.isLoading}
                />
                <NumberField
                    label={`Price`}
                    value={price}
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={createPricing.isLoading}
                />
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
    }
}