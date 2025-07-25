import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {businessCreateSchema, type BusinessCreateSchema} from "@/modules/business/schema/business-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@heroui/react";
import {useCreateBusiness} from "@/modules/business/api/useCreateBusiness.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {useNavigate} from "react-router-dom";
import {toastSuccess} from "@/shared/utils/toast.ts";

export default function useCreateBusinessModal(props?: {
    onSuccess?: () => void;
}) {

    // define hooks
    const navigate = useNavigate()

    // define state
    const modal = useModal()
    const form = useForm<BusinessCreateSchema>({
        resolver: zodResolver(businessCreateSchema)
    })

    // forms
    const name = form.watch('name')
    const description = form.watch('description')
    const { errors } = form.formState

    // define mutations
    const createBusiness = useCreateBusiness({
        onSuccess: async ({message, data}) => {
            props?.onSuccess?.()
            toastSuccess(message || 'Successful')
            navigate(`/${data?.business.id}`)
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define actions: onSubmit
    const onSubmit = async (data: BusinessCreateSchema) => {
        await createBusiness.mutateAsync(data)
    }

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header={'Create New Business'}
            footer={<>
                <Button variant={'flat'} color={'default'} onPress={modal.onClose}>
                    Close
                </Button>
                <Button type={'submit'} form={'app-form'} isLoading={createBusiness.isLoading}>
                    Create
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                <TextField
                    autoFocus
                    label={'Business name'}
                    value={name}
                    {...form.register('name')}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    isDisabled={createBusiness.isLoading}
                />
                <TextArea
                    label={'About business'}
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={createBusiness.isLoading}
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