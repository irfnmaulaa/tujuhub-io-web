import {useModal, ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import {useForm} from "react-hook-form";
import {pricingCreateSchema, type PricingCreateSchema} from "@/modules/pricing/schema/pricing-schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreatePricing} from "@/modules/pricing/api/useCreatePricing.ts";
import {useCreatePricingBundle} from "@/modules/pricing/api/useCreatePricingBundle.ts";
import {setFormError} from "@/shared/utils/error.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import {useIndividualPricings} from "@/modules/pricing/api/useIndividualPricings.ts";
import NumberField from "@/shared/design-system/form/NumberField.tsx";
import Form from "@/shared/design-system/form/Form.tsx";
import {useState, useCallback} from "react";
import type {PricingItem} from "@/modules/pricing/types/pricing-type.ts";
import MultiSelectAutocomplete, { type Option } from "@/shared/design-system/form/MultiSelectAutocomplete.tsx";
import { useBundlePricings } from "../api/useBundlePricings";

export default function useCreatePricingBundleModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const [selectedPricingOptions, setSelectedPricingOptions] = useState<Option[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    // Default currency - easily configurable for future support
    const DEFAULT_CURRENCY = 'IDR'
    
    const form = useForm<PricingCreateSchema>({
        resolver: zodResolver(pricingCreateSchema),
        defaultValues: {
            type: 'bundle',
            currency: DEFAULT_CURRENCY
        }
    })

    // define queries
    const pricingBundles = useBundlePricings()
    // Fetch all individual pricings by default (empty search to get all items)
    const individualPricings = useIndividualPricings({ search: searchQuery })

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const price = form.watch('price')
    const { errors } = form.formState

    // define mutations
    const createPricing = useCreatePricing({
        onError: (error) => {
            setFormError({ form, error })
        }
    })
    
    const createPricingBundle = useCreatePricingBundle({
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    // define actions: onSubmit
    const onSubmit = async (data: PricingCreateSchema) => {
        try {
            // Step 1: Create the bundle
            const bundleData = { 
                ...data, 
                type: 'bundle' as const,
                currency: DEFAULT_CURRENCY
            }
            const bundleResponse = await createPricing.mutateAsync(bundleData)
            const bundleId = bundleResponse.data?.pricing.id
            
            // Step 2: Add selected pricing items to the bundle
            if (!bundleId) {
                throw new Error('Failed to create bundle')
            }
            const addPricingPromises = selectedPricingOptions.map(option => 
                createPricingBundle.mutateAsync({
                    productId: bundleId,
                    pricingId: option.value
                })
            )
            
            await Promise.all(addPricingPromises)
            
            // Success handling
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess('Bundle created successfully')
            await pricingBundles.refetch()
            
            // Reset form and selected items
            form.reset()
            setSelectedPricingOptions([])
        } catch (error) {
            // Error handling is already done in mutation hooks
            console.error('Error creating bundle:', error)
        }
    }

    // define element
    const Element = (
        <ModalElement
            control={modal}
            header={`Create new bundle`}
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
                {/* Step 1: Bundle Identity */}
                <TextField
                    autoFocus
                    label={`Bundle name`}
                    description="Give your bundle a clear, descriptive name"
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={createPricing.isLoading}
                />
                
                {/* Step 2: Bundle Contents - Most Important */}
                {/* Choose the individual pricing items that will be included in this bundle */}
                <MultiSelectAutocomplete
                    label="Select Product Items to Add to Bundle"
                    placeholder="Search and select pricing items..."
                    value={selectedPricingOptions}
                    onChange={setSelectedPricingOptions}
                    initialOptions={(() => {
                        const items = individualPricings.data?.items || [];
                        return items.map((pricing: PricingItem) => ({
                            value: pricing.id,
                            label: pricing.title,
                            description: `${pricing.currency} ${pricing.price?.toLocaleString()} ${pricing.description ? '• ' + pricing.description : ''}`
                        }));
                    })()}
                    onSearch={useCallback(async (query: string) => { 
                        // Update search query to trigger API call
                        setSearchQuery(query);
                        
                        // Return current items (will be updated by the API call)
                        const items = individualPricings.data?.items || []; 
                        return items.map((pricing: PricingItem) => ({
                            value: pricing.id,
                            label: pricing.title,
                            description: `${pricing.currency} ${pricing.price?.toLocaleString()} ${pricing.description ? '• ' + pricing.description : ''}`
                        }));
                    }, [individualPricings.data?.items])}
                    isLoading={individualPricings.isLoading}
                    isDisabled={createPricing.isLoading || createPricingBundle.isLoading}
                    minSearchLength={0}
                    debounceMs={200}
                    noOptionsText="No pricing items found"
                    searchingText="Searching pricing items..."
                />
                
                {/* Step 3: Bundle Pricing */}
                <NumberField
                    label={`Bundle Price (IDR)`}
                    description="Set the total price for this bundle. Consider offering a discount compared to individual item prices."
                    value={price}
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={createPricing.isLoading}
                    formatOptions={{
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                    }}
                />
                
                {/* Step 4: Additional Details */}
                <TextArea
                    label={`Description (Optional)`}
                    description="Add details about what makes this bundle special or any terms and conditions"
                    placeholder="Describe the value proposition of this bundle..."
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
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