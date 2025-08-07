import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {productCreateSchema, type ProductCreateSchema} from "@/modules/product/schema/product-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateProduct} from "@/modules/product/api/useCreateProduct.ts";
import {useCreatePricing} from "@/modules/pricing/api/useCreatePricing.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useCourses from "@/modules/product/api/useCourses.ts";
import NumberField from "@/shared/design-system/form/NumberField.tsx";
import Form from "@/shared/design-system/form/Form.tsx";
import useEvents from "../api/useEvents";
import useMemberships from "../api/useMemberships";

export default function useAddProductModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<ProductCreateSchema>({
        resolver: zodResolver(productCreateSchema)
    })

    // define queries
    const courses = useCourses()
    const events = useEvents()
    const memberships = useMemberships()

    // forms
    const title = form.watch('title')
    const summary = form.watch('summary')
    const price = form.watch('price')
    const type = form.watch('productType')
    const { errors } = form.formState

    // define mutations
    const createProduct = useCreateProduct({ 
        onError: (error) => {
            setFormError({ form, error })
        }
    })
    const createPricing = useCreatePricing({
        onError: (error) => {
            setFormError({ form, error })
        }
    })


    // define actions: onSubmit
    const onSubmit = async (data: ProductCreateSchema) => {
        const productResult = await createProduct.mutateAsync(data)
        
        // Create pricing entry with initial price and created product ID
        if (productResult?.data?.product?.id) {
            const pricingResult = await createPricing.mutateAsync({
                title: data.title,
                type: 'individual',
                productId: productResult.data.product.id,
                currency: 'IDR',
                price: data.price || 0
            })

            if(pricingResult?.data?.pricing?.id) {
                props?.onSuccess?.()

                modal.onClose()
                toastSuccess(productResult.message || 'Successful')

                if(type === 'course') {
                    await courses.refetch()
                } else if(type === 'event') {
                    await events.refetch()
                } else if(type === 'membership') {
                    await memberships.refetch()
                }
            }
        }
    }

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header={`Create new ${type}`}
            footer={<>
                <Button size='lg' variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Close
                </Button>
                <Button size='lg' type={'submit'} form={'app-form'} isLoading={createProduct.isLoading}>
                    Create
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    label={`Name of ${type || 'product'}`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={createProduct.isLoading}
                />
                <TextArea
                    label={`About ${type || 'product'}`}
                    value={summary}
                    {...form.register('summary')}
                    isInvalid={!!errors.summary}
                    errorMessage={errors.summary?.message}
                    isDisabled={createProduct.isLoading}
                />
                <NumberField
                    label={`Initial Price`}
                    value={price} 
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={createProduct.isLoading}
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