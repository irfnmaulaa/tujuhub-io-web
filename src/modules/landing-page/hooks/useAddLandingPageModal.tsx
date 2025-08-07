import { useModal } from "@/shared/hooks/useModal.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import TextArea from "@/shared/design-system/form/TextArea.tsx";
import { useForm } from "react-hook-form";
import { landingPageCreateSchema, type LandingPageCreateSchema } from "@/modules/landing-page/schema/landing-page-schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLandingPage } from "@/modules/landing-page/api/useCreateLandingPage.ts";
import { useCreateLandingPagePricing } from "@/modules/landing-page/api/useCreateLandingPagePricing.ts";
import { setFormError } from "@/shared/utils/error.ts";
import useLandingPages from "@/modules/landing-page/api/useLandingPages.ts";
import usePricings from "@/modules/pricing/api/usePricings.ts";
import { Select, SelectItem } from "@heroui/react";
import { MultiSelectAutocomplete, WizardModal, type Option } from "@/shared/design-system/form"; 
import { useState, useCallback } from "react";
import type { PricingItem } from "@/modules/pricing/types/pricing-type.ts";

export default function useAddLandingPageModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const form = useForm<LandingPageCreateSchema>({
        resolver: zodResolver(landingPageCreateSchema),
        defaultValues: {
            type: 'default'
        }
    })
    const [selectedPricings, setSelectedPricings] = useState<Option[]>([])

    // define queries
    const landingPages = useLandingPages()
    const pricings = usePricings()

    // forms
    const title = form.watch('title')
    const description = form.watch('description')
    const type = form.watch('type')
    const { errors } = form.formState

    // define mutations
    const createLandingPage = useCreateLandingPage({
        onSuccess: async (response) => { 
            if(response.data)
            await landingPages.refetch()
        },
        onError: (error) => {
            setFormError({ form, error })
        }
    })

    const createLandingPagePricing = useCreateLandingPagePricing({
        onSuccess: async () => {
            // Pricing added successfully
        },
        onError: (error) => {
            console.error('Error adding pricing to landing page:', error)
        }
    })

    // define handlers
    const validateStep1 = async () => {
        const isValid = await form.trigger(['title', 'description', 'type'])
        return isValid
    }

    const validateStep2 = async () => {
        return selectedPricings.length > 0
    }

    const handleComplete = async () => {
        try {
            // First create the landing page
            const landingPageData = form.getValues()
            const landingPageResponse = await createLandingPage.mutateAsync(landingPageData)
            const landingPageId = landingPageResponse.data?.landingPage.id

            // Then add selected pricings to the landing page
            if(landingPageId) {
                for (const pricing of selectedPricings) {
                    await createLandingPagePricing.mutateAsync({
                        landingPageId,
                        pricingId: pricing.value
                    })
                }
            } 

            // Reset form and close modal
            form.reset()
            setSelectedPricings([])
            props?.onSuccess?.()
        } catch (error) {
            console.error('Error creating landing page:', error)
        }
    }

    // Search function for pricing selection
    const searchPricings = useCallback(async (query: string): Promise<Option[]> => {
        const items = pricings.data?.items || []
        const filteredItems = items.filter((pricing: PricingItem) => 
            pricing.title.toLowerCase().includes(query.toLowerCase())
        )
        
        return filteredItems.map((pricing: PricingItem) => ({
            value: pricing.id,
            label: pricing.title,
            description: `${pricing.type} • ${pricing.currency} ${pricing.price.toLocaleString()}`
        }))
    }, [pricings.data?.items])

    // define element
    const Element = (
        <WizardModal
            control={modal}
            header="Add Landing Page"
            steps={[
                {
                    title: 'Basic Information',
                    content: (
                        <div className="flex flex-col gap-3.5">
                            <TextField
                                autoFocus
                                label="Title"
                                placeholder="Enter landing page title"
                                value={title || ''}
                                {...form.register('title')}
                                isInvalid={!!errors.title}
                                errorMessage={errors.title?.message}
                                isDisabled={createLandingPage.isLoading}
                            />
                            
                            <TextArea
                                label="Description"
                                placeholder="Enter landing page description"
                                value={description || ''}
                                {...form.register('description')}
                                isInvalid={!!errors.description}
                                errorMessage={errors.description?.message}
                                isDisabled={createLandingPage.isLoading}
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
                                isDisabled={createLandingPage.isLoading}
                            >
                                <SelectItem key={'default'}>
                                    Default
                                </SelectItem>
                                <SelectItem key={'home'}>
                                    Home
                                </SelectItem>
                            </Select>
                        </div>
                    ),
                    validation: validateStep1,
                },
                {
                    title: 'Select Products',
                    content: (
                        <div className="flex flex-col gap-3.5">
                            <div className="text-sm text-gray-600 mb-2">
                                Choose the products you want to feature on this landing page
                            </div>
                            <MultiSelectAutocomplete
                                label="Products"
                                placeholder="Search and select products..."
                                value={selectedPricings}
                                onChange={setSelectedPricings}
                                onSearch={searchPricings}
                                initialOptions={(() => {
                                    const items = pricings.data?.items || []
                                    return items.map((pricing: PricingItem) => ({
                                        value: pricing.id,
                                        label: pricing.title,
                                        description: `${pricing.type} • ${pricing.currency} ${pricing.price.toLocaleString()}`
                                    }))
                                })()}
                                isLoading={pricings.isLoading}
                                isDisabled={createLandingPage.isLoading || createLandingPagePricing.isLoading}
                                minSearchLength={0}
                                debounceMs={200}
                                noOptionsText="No products found"
                                searchingText="Searching products..."
                            />
                            {selectedPricings.length === 0 && (
                                <div className="text-sm text-red-500">
                                    Please select at least one product
                                </div>
                            )}
                        </div>
                    ),
                    validation: validateStep2,
                }
            ]}
            onComplete={handleComplete}
            showProgress={true}
            showStepNumbers={true}
        />
    )

    return {
        ...modal,
        Element,
        form,
        selectedPricings,
        setSelectedPricings
    }
}