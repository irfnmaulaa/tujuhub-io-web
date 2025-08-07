import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {landingPageUpdateSchema, type LandingPageUpdateSchema} from "@/modules/landing-page/schema/landing-page-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateLandingPage} from "@/modules/landing-page/api/useUpdateLandingPage.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useLandingPages from "@/modules/landing-page/api/useLandingPages.ts";
import Form from "@/shared/design-system/form/Form.tsx";
import {Select, SelectItem} from "@heroui/react";
import {useState, useEffect} from "react";
import {type LandingPageItem} from "@/modules/landing-page/types/landing-page-types.ts";

export default function useEditLandingPageModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<LandingPageUpdateSchema>({
        resolver: zodResolver(landingPageUpdateSchema)
    })
    const [item, setItem] = useState<LandingPageItem | null>(null)

    // define queries
    const landingPages = useLandingPages()

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const type = form.watch('type')
    const slug = form.watch('slug')
    const { errors } = form.formState

    // define mutations
    const updateLandingPage = useUpdateLandingPage({
        onSuccess: async ({message}) => {
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess(message || 'Landing page updated successfully')
            await landingPages.refetch()
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define handlers
    const onSubmit = form.handleSubmit(async (data) => {
        if (!item?.id) return
        await updateLandingPage.mutateAsync({id: item.id, data})
    })

    const onClose = () => {
        modal.onClose()
        form.reset()
        setItem(null)
    }

    const onOpen = (landingPage: LandingPageItem) => {
        setItem(landingPage)
        form.setValue('title', landingPage.title)
        form.setValue('description', landingPage.description || '')
        form.setValue('type', landingPage.type)
        form.setValue('slug', landingPage.slug)
        modal.onOpen()
    }

    // effects
    useEffect(() => {
        if (!modal.isOpen) {
            setItem(null)
            form.reset()
        }
    }, [modal.isOpen, form])

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header="Edit Landing Page"
            footer={<>
                <Button 
                    size='lg' 
                    variant={'flat'} 
                    color={'default'} 
                    onPress={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    size='lg' 
                    type={'submit'} 
                    form={'edit-landing-page-form'} 
                    isLoading={updateLandingPage.isLoading}
                    color={'primary'}
                >
                    Update Landing Page
                </Button>
            </>}
        >
            <Form id={'edit-landing-page-form'} onSubmit={onSubmit}>
                <TextField
                    autoFocus
                    label="Title"
                    placeholder="Enter landing page title"
                    value={title || ''}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={updateLandingPage.isLoading}
                />

                <TextField
                    label="Slug"
                    placeholder="Enter landing page slug"
                    value={slug || ''}
                    {...form.register('slug')}
                    isInvalid={!!errors.slug}
                    errorMessage={errors.slug?.message}
                    isDisabled={updateLandingPage.isLoading}
                />
                
                <TextArea
                    label="Description"
                    placeholder="Enter landing page description"
                    value={description || ''}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={updateLandingPage.isLoading}
                />
                
                <Select
                    label="Type"
                    placeholder="Select landing page type"
                    selectedKeys={type ? [type] : []}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string
                        form.setValue('type', selectedKey as 'default' | 'home')
                    }}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type?.message}
                    isDisabled={updateLandingPage.isLoading}
                >
                    <SelectItem key={'default'}>
                        Default
                    </SelectItem>
                    <SelectItem key={'home'}>
                        Home
                    </SelectItem>
                </Select>
            </Form>
        </ModalElement>
    )

    return {
        ...modal,
        Element,
        form,
        item,
        setItem,
        onOpen
    }
}