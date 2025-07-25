import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {productCreateSchema, type ProductCreateSchema} from "@/modules/product/schema/product-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@heroui/react";
import {useCreateProduct} from "@/modules/product/api/useCreateProduct.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useCourses from "@/modules/product/api/useCourses.ts";

export default function useCreateProductModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<ProductCreateSchema>({
        resolver: zodResolver(productCreateSchema)
    })

    // define queries
    const courses = useCourses()

    // forms
    const title = form.watch('title')
    const summary = form.watch('summary')
    const type = form.watch('productType')
    const { errors } = form.formState

    // define mutations
    const createProduct = useCreateProduct({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Successful')

            if(type === 'course') {
                await courses.refetch()
            }
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define actions: onSubmit
    const onSubmit = async (data: ProductCreateSchema) => {
        await createProduct.mutateAsync(data)
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
                <Button type={'submit'} form={'app-form'} isLoading={createProduct.isLoading}>
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
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
    }
}