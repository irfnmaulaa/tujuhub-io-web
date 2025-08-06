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
import { useEffect, useState, useCallback } from "react";
import { type PricingItem } from "@/modules/pricing/types/pricing-type.ts";
import { useBundlePricings } from "../api/useBundlePricings";
import useProducts from "@/modules/product/api/useProducts.ts";
import type {ProductItem} from "@/modules/product/types/product-type.ts";
import MultiSelectAutocomplete, { type Option } from "@/shared/design-system/form/MultiSelectAutocomplete.tsx";
import { useCreatePricingBundle } from "@/modules/pricing/api/useCreatePricingBundle.ts";
import { useDeletePricingBundleProduct } from "@/modules/pricing/api/useDeletePricingBundleProduct.ts";

export default function useEditPricingBundleModal(props?: {
    onSuccess?: () => void;
}) {

    // define state
    const modal = useModal()
    const [item, setItem] = useState<PricingItem | null>(null)
    const [selectedProductOptions, setSelectedProductOptions] = useState<Option[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    
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
    // Fetch all products by default, filter by search query
    const products = useProducts({ search: searchQuery })

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
    
    const createPricingBundle = useCreatePricingBundle()
    const deletePricingBundleProduct = useDeletePricingBundleProduct()

    // define actions: onSubmit
    const onSubmit = async (data: PricingUpdateSchema) => {
        if (!item) return
        
        try {
            // Step 1: Update the bundle details
            const updateData = {
                ...data,
                currency: DEFAULT_CURRENCY
            }
            await updatePricing.mutateAsync({
                id: item.id,
                data: updateData
            })
            
            // Step 2: Handle product changes
            const currentProductIds = item.bundleProducts?.map(bp => bp.product?.id).filter((id): id is string => Boolean(id)) || []
            const selectedProductIds = selectedProductOptions.map(option => option.value)
            
            // Find products to add (new selections)
            const productsToAdd = selectedProductIds.filter(id => !currentProductIds.includes(id))
            
            // Find products to remove (unselected)
            const productsToRemove = currentProductIds.filter(id => !selectedProductIds.includes(id))
            
            // Add new products to bundle
            const addPromises = productsToAdd.map(productId => 
                createPricingBundle.mutateAsync({
                    productId: productId,
                    pricingId: item.id
                })
            )
            
            // Remove unselected products from bundle
            const removePromises = productsToRemove.map(productId => 
                deletePricingBundleProduct.mutateAsync({
                    pricingId: item.id,
                    productId: productId
                })
            )
            
            // Execute all product changes
            await Promise.all([...addPromises, ...removePromises])
            
            // Success handling
            props?.onSuccess?.()
            modal.onClose()
            toastSuccess('Bundle updated successfully')
            await pricingBundles.refetch()
            
        } catch (error) {
            console.error('Error updating bundle:', error)
            // Error handling is already done in mutation hooks
        }
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
            
            // Populate selected products from bundle
            const currentProducts = item.bundleProducts?.map(bp => {
                const product = bp.product;
                if (!product?.id || !product?.title) return null;
                return {
                    value: product.id,
                    label: product.title,
                    description: `${product.productType || ''} ${product.summary ? '• ' + product.summary : ''}`
                };
            }).filter((option): option is NonNullable<typeof option> => option !== null) || []
            
            setSelectedProductOptions(currentProducts)
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
                <Button type={'submit'} form={'app-form'} isLoading={updatePricing.isLoading || createPricingBundle.isLoading || deletePricingBundleProduct.isLoading}>
                    Update
                </Button>
            </>}
        >
            <Form id={'app-form'} onSubmit={form.handleSubmit(onSubmit)}>
                {/* 1. Bundle Name - Essential identifier */}
                <TextField
                    autoFocus
                    label={`Bundle Name`}
                    value={title}
                    {...form.register('title')}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    isDisabled={updatePricing.isLoading}
                    placeholder="Enter a clear, descriptive bundle name"
                    description="Choose a name that clearly identifies this bundle for customers"
                />
                
                {/* 2. Bundle Price - Critical business value */}
                {/* Currency field removed - currently only supports IDR */}
                {/* TODO: Add currency selector when multiple currencies are supported */}
                <NumberField
                    label={`Bundle Price`}
                    value={price}
                    onValueChange={number => form.setValue('price', number)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price?.message}
                    isDisabled={updatePricing.isLoading}
                    placeholder="Set competitive bundle price"
                    description="Price should reflect the combined value of all included products"
                />
                
                {/* 3. Product Selection - Defines bundle content and value */}
                 {/* Select products that complement each other and provide value as a bundle */}
                 <MultiSelectAutocomplete
                     label="Bundle Products"
                     placeholder="Search and select products to include in this bundle..."
                     value={selectedProductOptions}
                     onChange={setSelectedProductOptions}
                     initialOptions={(() => {
                         const items = products.data?.items || [];
                         return items.map((product: ProductItem) => ({
                             value: product.id,
                             label: product.title,
                             description: `${product.productType} ${product.summary ? '• ' + product.summary : ''}`
                         }));
                     })()}
                     onSearch={useCallback(async (query: string) => { 
                         // Update search query to trigger API call
                         setSearchQuery(query);
                         
                         // Return current items (will be updated by the API call)
                         const items = products.data?.items || []; 
                         return items.map((product: ProductItem) => ({
                             value: product.id,
                             label: product.title,
                             description: `${product.productType} ${product.summary ? '• ' + product.summary : ''}`
                         }));
                     }, [products.data?.items])}
                     isLoading={products.isLoading}
                     isDisabled={updatePricing.isLoading || createPricingBundle.isLoading || deletePricingBundleProduct.isLoading}
                     minSearchLength={0}
                     debounceMs={200}
                     noOptionsText="No products found"
                     searchingText="Searching products..."
                 />
                
                {/* 4. Description - Supporting marketing information */}
                <TextArea
                    label={`Bundle Description`}
                    value={description}
                    {...form.register('description')}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    isDisabled={updatePricing.isLoading}
                    placeholder="Describe the benefits and value proposition of this bundle..."
                    description="Explain why customers should choose this bundle over individual products"
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