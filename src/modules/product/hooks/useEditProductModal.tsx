import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {productUpdateSchema, type ProductUpdateSchema} from "@/modules/product/schema/product-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, Switch} from "@heroui/react";
import {useUpdateProduct} from "@/modules/product/api/useUpdateProduct.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useCourses from "@/modules/product/api/useCourses.ts";
import {useEffect, useState} from "react";
import type {ProductItem} from "@/modules/product/types/product-type.ts";

export default function useEditProductModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<ProductUpdateSchema>({
        resolver: zodResolver(productUpdateSchema)
    })
    const [item, setItem] = useState<ProductItem|null>(null)

    // define queries
    const courses = useCourses()

    // forms
    const title = form.watch('title')
    const summary = form.watch('summary')
    const isPublished = form.watch('isPublished')
    const { errors } = form.formState

    // define mutations
    const updateProduct = useUpdateProduct({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Successful')

            if(item?.productType === 'course') {
                await courses.refetch()
            }
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define actions: onSubmit
    const onSubmit = async (data: ProductUpdateSchema) => {
        if(item) {
            await updateProduct.mutateAsync({
                data,
                id: item.id,
            })
        }
    }

    useEffect(() => {
        if(item) {
            Object.entries(item).forEach(([key, value]) => {
                form.setValue(key as keyof ProductUpdateSchema, value as any);
            })
            form.setValue('summary', item.summary || '')
            form.setValue('isPublished', Boolean(item.isPublished))
        }
    }, [item]);

    // define element
    const Element = item && (
        <ModalElement
            control={modal}
            header={`Quick edit`}
            footer={<div>
                <Button variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Cancel
                </Button>
                <Button type={'submit'} form={'app-form'} isLoading={updateProduct.isLoading}>
                    Save
                </Button>
            </div>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    label={`Name of ${item.productType || 'product'}`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={updateProduct.isLoading}
                />
                <TextArea
                    label={`About ${item.productType || 'product'}`}
                    value={summary}
                    {...form.register('summary')}
                    isInvalid={!!errors.summary}
                    errorMessage={errors.summary?.message}
                    isDisabled={updateProduct.isLoading}
                />
                <Switch isSelected={isPublished} onValueChange={val => form.setValue('isPublished', val)}>
                    Publish
                </Switch>
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