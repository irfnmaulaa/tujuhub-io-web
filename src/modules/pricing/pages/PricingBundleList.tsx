import BusinessLayout from "@/shared/layouts/BusinessLayout.tsx";
import BusinessPageContent from "@/shared/layouts/BusinessPageContent.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import {
    TbChevronDown,
    TbDotsVertical,
    TbFileDots,
    TbList,
    TbPencilBolt,
    TbPlus,
    TbTrash, TbX
} from "react-icons/tb";
import ContentList from "@/shared/layouts/ContentList.tsx";
import { useEffect, useMemo, useState } from "react";
import SimpleTable from "@/shared/components/table/SimpleTable.tsx";
import type { PricingItem } from "@/modules/pricing/types/pricing-type.ts";
import { Checkbox, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@heroui/react";
import { NavLink, useParams } from "react-router-dom";
import useDate from "@/shared/hooks/useDate.ts";
import SharedImage from "@/shared/components/image/SharedImage.tsx";
import useCreatePricingBundleModal from "@/modules/pricing/hooks/useCreatePricingBundleModal.tsx";
import useEditPricingBundleModal from "@/modules/pricing/hooks/useEditPricingBundleModal.tsx";
import useDeletePricingModal from "@/modules/pricing/hooks/useDeletePricingModal.tsx";
import useBulkPricingAction from "@/modules/pricing/hooks/useBulkPricingAction.tsx";
import { useBundlePricings } from "../api/useBundlePricings";

const displayModes = [
    {
        key: 'list',
        label: 'List',
        icon: <TbList className={'size-5'}/>,
    },
]

const sortBy = [
    {key: 'createdAt-desc', label: 'Newest Bundles'},
    {key: 'createdAt-asc', label: 'Oldest Bundles'},
]

export default function PricingBundleList() {

    // define hooks
    const {businessId} = useParams()
    const date = useDate()

    // define state
    const [currentPricingBundles, setCurrentPricingBundles] = useState<PricingItem[]>([])

    // define queries
    const pricingBundles = useBundlePricings()

    // define mutations

    // define modals
    const createPricingModal = useCreatePricingBundleModal()
    const editPricingModal = useEditPricingBundleModal()
    const deletePricingModal = useDeletePricingModal()
    const bulkAction = useBulkPricingAction()

    // define computed
    const selectedPricingBundles = useMemo(() => {
        return currentPricingBundles.filter(bundle => bundle.isChecked)
    }, [currentPricingBundles])

    const clearSelected = () => {
        setCurrentPricingBundles(prevState => prevState.map(bundle => ({...bundle, isChecked: false})))
    }

    useEffect(() => {
        if(pricingBundles.data) {
            setCurrentPricingBundles(pricingBundles.data.items)
        }
    }, [pricingBundles.data]);

    return (
        <BusinessLayout
            pageTitle={'Bundles'}
            menuActive={'pricing-bundle'}
        >

            <BusinessPageContent
                title={'Bundles'}
                actions={
                    <Button startContent={<div>
                        <TbPlus className="size-5 me-[-5px]"/>
                    </div>} onPress={() => {
                        createPricingModal.onOpen()
                    }} radius={'full'} variant={'flat'}>
                        Create
                    </Button>
                }
            >

                <ContentList
                    stickyTop={0}
                    list={<div>

                        <SimpleTable
                            stickyTop={53}
                            defaultSortBy={'updatedAt-desc'}
                            columns={[
                                {
                                    key: 'name',
                                    label: 'Bundle',
                                    size: 3,
                                    isSortable: true,
                                },
                                {
                                    key: 'products',
                                    label: 'Products',
                                    size: 2,
                                    isSortable: false,
                                },
                                {
                                    key: 'price',
                                    label: 'Price',
                                    size: 1,
                                    isSortable: false,
                                },
                                {
                                    key: 'updatedAt',
                                    label: 'Last Updated',
                                    size: 1,
                                    isSortable: true,
                                },
                            ]}
                            rows={currentPricingBundles.map((item, i) => ({
                                _checkbox: {
                                    value: (<Checkbox isSelected={Boolean(item.isChecked)}
                                                      onChange={() => setCurrentPricingBundles(prevState => prevState.map((val, index) => index === i ? {
                                                          ...val,
                                                          isChecked: !val.isChecked
                                                      } : val))}/>
                                    )
                                },
                                name: {
                                    value: (
                                        <div className={'flex gap-5'}>

                                            {/* S: Thumbnail */}
                                            <div>
                                                <NavLink to={`/${businessId}/pricing-bundles/${item.id}/overview`}>
                                                    {item.bundleProducts && item.bundleProducts.length > 0 ? (
                                                        <div className="h-[60px] grid gap-0.5">
                                                            {item.bundleProducts.length === 1 && (
                                                                <SharedImage
                                                                    src={item.bundleProducts[0].product?.thumbnailSrc || ''}    
                                                                    radius={'lg'}
                                                                    className={'aspect-[16/9] h-[60px]'}
                                                                />
                                                            )} 
                                                            {item.bundleProducts.length > 1 && (
                                                                <div className="grid grid-cols-2 gap-1 relative aspect-[16/9] h-[60px]">
                                                                        {item.bundleProducts.slice(0, 3).map((product, idx) => (
                                                                            <div className="w-full">
                                                                                <SharedImage
                                                                                    key={idx}
                                                                                    src={product.product?.thumbnailSrc || ''}
                                                                                    radius={'sm'}
                                                                                    className={'aspect-[16/9] w-full'}
                                                                                    fallbackSrc={'/img/placeholder.png'}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                        {item.bundleProducts.length > 3 ? (
                                                                            <div className="relative w-full">
                                                                                <SharedImage
                                                                                    src={item.bundleProducts[3].product?.thumbnailSrc || ''}
                                                                                    radius={'sm'}
                                                                                    className={cn(
                                                                                        'aspect-[16/9] w-full',
                                                                                        item.bundleProducts.length > 4 ? 'opacity-50' : ''
                                                                                    )}
                                                                                    fallbackSrc={'/img/placeholder.png'}
                                                                                />
                                                                                {item.bundleProducts.length > 4 && (
                                                                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 text-white text-xs font-medium rounded-sm">
                                                                                        +{item.bundleProducts.length - 4}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <SharedImage
                                                            src={''}
                                                            radius={'lg'}
                                                            className={'aspect-[16/9] h-[60px]'}
                                                            fallbackSrc={'/img/placeholder.png'}
                                                        />
                                                    )}
                                                </NavLink>
                                            </div>
                                            {/* E: Thumbnail */}

                                            {/* S: Title and Actions */}
                                            <div className={'grid grid-rows-[auto_1fr] w-full'}>

                                                {/* S: Title */}
                                                <div className={'flex items-center gap-1.5 pt-0.5'}>
                                                    <NavLink
                                                        to={`/${businessId}/pricing-bundles/${item.id}/overview`}
                                                        className={'hover:underline line-clamp-1'}>
                                                        {item.title} 
                                                    </NavLink>
                                                </div>
                                                {/* E: Title */}

                                                {/* S: Actions */}
                                                <div className={'relative pt-0.5'}>
                                                    <div
                                                        className={'group-hover:hidden text-default-500 text-sm line-clamp-1'}>
                                                        {item.description}
                                                    </div>
                                                    <div
                                                        className={'absolute left-0 top-0 group-hover:opacity-100 opacity-0 flex items-center gap-1 ms-[-6px]'}>
                                                        <Tooltip placement={'bottom'} content={'Quick edit'}>
                                                            <Button color={'default'} size={'sm'} variant={'light'}
                                                                    className={'rounded-full'} isIconOnly
                                                                    onPress={() => {
                                                                        editPricingModal.setItem(item)
                                                                        editPricingModal.onOpen()
                                                                    }}>
                                                                <TbPencilBolt className={'size-5'}/>
                                                            </Button>
                                                        </Tooltip>
                                                        <div
                                                            className={'h-[20px] w-[1px] bg-default-200 mx-2'}></div>
                                                        <Dropdown placement={'bottom-start'}>
                                                            <DropdownTrigger>
                                                                <Button color={'default'} size={'sm'} variant={'light'} isIconOnly
                                                                        className={'rounded-full'}>
                                                                    <TbDotsVertical className={'size-5'}/>
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu onAction={async (key) => {
                                                                if(key === 'move-to-trash') {
                                                                    deletePricingModal.setItem(item)
                                                                    deletePricingModal.onOpen()
                                                                }
                                                            }}>
                                                                <DropdownItem startContent={<TbTrash
                                                                    className={'size-5'}/>} key={'move-to-trash'}
                                                                              className={'text-red-500'}>Move to trash</DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                {/* E: Actions */}

                                            </div>
                                            {/* E: Title and Actions */}

                                        </div>
                                    ),
                                },
                                products: {
                                    value: (
                                        <Tooltip
                                            content={
                                                item.bundleProducts && item.bundleProducts.length > 2 ? (
                                                    <div className="py-2 px-3">
                                                        {item.bundleProducts.slice(2).map(product => (
                                                            <div key={product.product?.id}>{product.product?.title}</div>
                                                        ))}
                                                    </div>
                                                ) : null
                                            }
                                            placement="bottom"
                                        >
                                            <div className={'text-default-500 text-sm hover:cursor-help'}>
                                                {item.bundleProducts && item.bundleProducts.length > 0 ? (
                                                    <>
                                                        {item.bundleProducts.slice(0, 2).map(product => product.product?.title).join(', ')}
                                                        {item.bundleProducts.length > 2 && (
                                                            <span className="text-primary-500">
                                                                {` and ${item.bundleProducts.length - 2} more ${item.bundleProducts.length - 2 === 1 ? 'product' : 'products'}`}
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    'No products'
                                                )}
                                            </div>
                                        </Tooltip>
                                    )
                                },
                                price: {
                                    value: (
                                        <div className={'text-default-500 text-sm pt-0.5'}>
                                            {item.price ? (
                                                new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: item.currency || 'IDR',
                                                    minimumFractionDigits: 0
                                                }).format(item.price)
                                            ) : (
                                                <span className={'text-default-400'}>No pricing</span>
                                            )}
                                        </div>
                                    ),
                                },
                                updatedAt: {
                                    value: <div
                                        className={'font-light text-default-500 text-sm pt-0.5'}>{date.create(item.updatedAt || item.createdAt).format('D MMM YYYY')}</div>,
                                },
                            }))}
                            bulk={<>
                                {selectedPricingBundles.length > 0 && (
                                    <div
                                        className={'border-b border-default px-10 py-4 bg-primary text-foreground flex items-center justify-between gap-8'}>
                                        <div className={'flex items-center gap-3'}>
                                            <div className={'text-sm font-semibold'}>
                                                {selectedPricingBundles.length} selected
                                            </div>
                                            <Button size={'sm'} variant={'light'} onPress={clearSelected}>
                                                <TbX className={'size-4'}/>
                                                Clear
                                            </Button>
                                        </div>
                                        <div className={'flex items-center gap-2'}>
                                            <Dropdown placement={'bottom-end'}>
                                                <DropdownTrigger>
                                                    <Button size={'sm'} variant={'flat'} endContent={<TbChevronDown
                                                        className={'size-4'}/>}>
                                                        Bulk Actions
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu onAction={async (key) => {
                                                    if (key === 'activate') {
                                                        bulkAction.action({
                                                            action: 'activate',
                                                            items: selectedPricingBundles
                                                        })
                                                    }
                                                    if (key === 'deactivate') {
                                                        bulkAction.action({
                                                            action: 'deactivate',
                                                            items: selectedPricingBundles
                                                        })
                                                    }
                                                    if (key === 'delete') {
                                                        bulkAction.action({
                                                            action: 'delete',
                                                            items: selectedPricingBundles
                                                        })
                                                    }
                                                }}>
                                                    <DropdownItem startContent={<TbFileDots
                                                        className={'size-5'}/>} key={'activate'}>
                                                        Activate
                                                    </DropdownItem>
                                                    <DropdownItem startContent={<TbFileDots
                                                        className={'size-5'}/>} key={'deactivate'}>
                                                        Set as Inactive
                                                    </DropdownItem>
                                                    <DropdownItem startContent={<TbTrash
                                                        className={'size-5'}/>} key={'delete'}
                                                                  className={'text-red-500'}>
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                )}
                            </>
                            }
                            selectAll={<>
                                <Checkbox
                                    isSelected={currentPricingBundles.length > 0 && currentPricingBundles.every(course => course.isChecked)}
                                    onChange={() => {
                                        setCurrentPricingBundles(prevState => prevState.map(item => ({
                                            ...item,
                                            isChecked: selectedPricingBundles.length < currentPricingBundles.length
                                        })))
                                    }}/>
                            </>}
                            isLoading={pricingBundles.isLoading}
                        />

                    </div>} 
                    displayModes={displayModes}
                    sortBy={sortBy}  
                    isLoading={pricingBundles.isLoading}
                />

            </BusinessPageContent>

            {/* Modals */}
            {createPricingModal.Element}
            {editPricingModal.Element}
            {deletePricingModal.Element}
            {bulkAction.Element}

        </BusinessLayout>
    )
}