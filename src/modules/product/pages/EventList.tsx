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
    TbTrash, TbUpload,
    TbX
} from "react-icons/tb";
import ContentList, {type DisplayMode} from "@/shared/layouts/ContentList.tsx";
import {useEffect, useMemo, useState} from "react";
import useEvents from "@/modules/product/api/useEvents.ts";
import SimpleTable from "@/shared/components/table/SimpleTable.tsx";
import type {ProductItem} from "@/modules/product/types/product-type.ts";
import {CardBody, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip} from "@heroui/react";
import {NavLink, useParams} from "react-router-dom";
import Card from "@/shared/design-system/card/Card.tsx";
import useDate from "@/shared/hooks/useDate.ts";
import useAddProductModal from "@/modules/product/hooks/useAddProductModal.tsx";
import useEditProductModal from "@/modules/product/hooks/useEditProductModal.tsx";
import useDeleteProductModal from "@/modules/product/hooks/useDeleteProductModal.tsx";
import useBulkProductAction from "@/modules/product/hooks/useBulkProductAction.tsx";
import SharedImage from "@/shared/components/image/SharedImage.tsx";

const displayModes = [
    {
        key: 'list',
        label: 'List',
        icon: <TbList className={'size-5'}/>,
    },
]

const sortBy = [
    {key: 'createdAt-desc', label: 'Newest Events'},
    {key: 'createdAt-asc', label: 'Oldest Events'},
]

export default function EventList() {

    // define hooks
    const {businessId} = useParams()
    const date = useDate()

    // define state
    const [mode, setMode] = useState<DisplayMode | null>(displayModes[0])
    const [currentEvents, setCurrentEvents] = useState<ProductItem[]>([])

    // define queries
    const events = useEvents()

    // define mutations

    // define modals
    const createProductModal = useAddProductModal()
    const editProductModal = useEditProductModal()
    const deleteProductModal = useDeleteProductModal()
    const bulkAction = useBulkProductAction()

    // define computed
    const selectedEvents = useMemo(() => {
        return currentEvents.filter(event => event.isChecked)
    }, [currentEvents])

    const clearSelected = () => {
        setCurrentEvents(prevState => prevState.map(event => ({...event, isChecked: false})))
    }

    useEffect(() => {
        if(events.data) {
            setCurrentEvents(events.data.items)
        }
    }, [events.data]);

    useEffect(() => {
        if(createProductModal.form) {
            createProductModal.form.setValue('productType', 'event')
        }
    }, [createProductModal.form]);

    return (
        <BusinessLayout
            pageTitle={'Events'}
            menuActive={'event'}
        >

            <BusinessPageContent
                title={'Events'}
                actions={
                    <Button startContent={<div>
                        <TbPlus className="size-5 me-[-5px]"/>
                    </div>} onPress={() => {
                        createProductModal.onOpen()
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
                                    key: 'title',
                                    label: 'Event',
                                    size: 3,
                                    isSortable: true,
                                }, 
                                {
                                    key: 'prices',
                                    label: 'Price(s)',
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
                            rows={currentEvents.map((item, i) => ({
                                _checkbox: {
                                    value: (<Checkbox isSelected={Boolean(item.isChecked)}
                                                      onChange={() => setCurrentEvents(prevState => prevState.map((val, index) => index === i ? {
                                                          ...val,
                                                          isChecked: !val.isChecked
                                                      } : val))}/>)
                                },
                                title: {
                                    value: (
                                        <div className={'flex gap-5'}>

                                            {/* S: Thumbnail */}
                                            <div>
                                                <NavLink to={`/${businessId}/events/${item.id}/overview`}>
                                                    <SharedImage
                                                        src={item.thumbnailSrc || ''}
                                                        radius={'lg'}
                                                        className={'aspect-[16/9] h-[60px]'}
                                                        fallbackSrc={'/img/placeholder.png'}
                                                    />
                                                </NavLink>
                                            </div>
                                            {/* E: Thumbnail */}

                                            {/* S: Title and Actions */}
                                            <div className={'grid grid-rows-[auto_1fr] w-full'}>

                                                {/* S: Title */}
                                                <div className={'flex items-center gap-1.5 pt-0.5'}>
                                                    <NavLink
                                                        to={`/${businessId}/events/${item.id}/overview`}
                                                        className={'hover:underline line-clamp-1'}>
                                                        {item.title}

                                                        {!item.isPublished && <span className={'font-semibold'}> —  Draft</span>}
                                                    </NavLink>
                                                </div>
                                                {/* E: Title */}

                                                {/* S: Actions */}
                                                <div className={'relative pt-0.5'}>
                                                    <div
                                                        className={'group-hover:hidden text-default-500 text-sm line-clamp-1'}>
                                                        {item.summary}
                                                    </div>
                                                    <div
                                                        className={'absolute left-0 top-0 group-hover:opacity-100 opacity-0 flex items-center gap-1 ms-[-6px]'}>
                                                        <Tooltip placement={'bottom'} content={'Quick edit'}>
                                                            <Button color={'default'} size={'sm'} variant={'light'}
                                                                    className={'rounded-full'} isIconOnly
                                                                    onPress={() => {
                                                                        editProductModal.setItem(item)
                                                                        editProductModal.onOpen()
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
                                                                    deleteProductModal.setItem(item)
                                                                    deleteProductModal.onOpen()
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
                                prices: {
                                    value: (
                                        <div className={'text-default-500 text-sm pt-0.5'}>
                                            {item.pricings && item.pricings.length > 0 ? (
                                                item.pricings.map((pricing, index) => (
                                                    <div key={pricing.id}>
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: pricing.currency || 'IDR',
                                                            minimumFractionDigits: 0
                                                        }).format(pricing.price)}
                                                    </div>
                                                ))
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
                                {selectedEvents.length > 0 && (
                                    <div
                                        className={'border-b border-default px-10 py-4 bg-primary text-foreground flex items-center justify-between gap-8'}>
                                        <div className="flex items-center gap-8">
                                            <div className={'font-light border-r border-white2 pe-8 py-2'}>
                                                {selectedEvents.length} selected
                                            </div>
                                            <div className={'flex items-center gap-6'}>
                                                <Dropdown placement={'bottom-start'}>
                                                    <DropdownTrigger>
                                                        <Card
                                                            className={'border-0 rounded-none bg-transparent text-foreground font-light'}
                                                            isPressable>
                                                            <CardBody
                                                                className={'p-0 flex-row gap-2 items-center'}>
                                                                <div>More actions</div>
                                                                <div>
                                                                    <TbChevronDown className={'size-5'}/>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </DropdownTrigger>
                                                    <DropdownMenu onAction={(action) => bulkAction.action({
                                                        items: selectedEvents,
                                                        action
                                                    })}>
                                                        <DropdownItem
                                                            startContent={<TbUpload className={'size-5'}/>}
                                                            key={'publish'}>Publish</DropdownItem>
                                                        <DropdownItem
                                                            startContent={<TbFileDots className={'size-5'}/>}
                                                            key={'set-draft'} showDivider>Set as
                                                            Draft</DropdownItem>
                                                        <DropdownItem className={'text-red-500'}
                                                                      startContent={<TbTrash
                                                                          className={'size-5'}/>}
                                                                      key={'delete'}>Delete</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div>
                                            <Button className={'rounded-full text-white2'} size={'sm'}
                                                    variant={'light'} isIconOnly onPress={clearSelected}>
                                                <TbX className={'size-6'}/>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>}
                            selectAll={<>
                                <Checkbox
                                    isSelected={currentEvents.length > 0 && currentEvents.every(event => event.isChecked)}
                                    onChange={() => {
                                        setCurrentEvents(prevState => prevState.map(item => ({
                                            ...item,
                                            isChecked: selectedEvents.length < currentEvents.length
                                        })))
                                    }}/>
                            </>}
                            isLoading={events.isLoading}
                        />

                    </div>}
                    filters={[
                        {
                            key: 'isPublished',
                            label: 'Status',
                            type: 'choices',
                            choices: [
                                {
                                    key: '1',
                                    label: 'Published',
                                },
                                {
                                    key: '0',
                                    label: 'Draft',
                                },
                            ]
                        },
                    ]}
                    sortBy={sortBy}
                    displayModes={displayModes}
                    activeMode={mode}
                    setActiveMode={(mode) => setMode(mode)}
                    data={events.data}
                    isLoading={events.isRefetching}
                />

                {createProductModal.Element}
                {editProductModal.Element}
                {deleteProductModal.Element}
                {bulkAction.Element}

            </BusinessPageContent>

        </BusinessLayout>
    )
}