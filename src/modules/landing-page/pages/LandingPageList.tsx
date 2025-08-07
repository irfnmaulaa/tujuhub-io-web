import BusinessLayout from "@/shared/layouts/BusinessLayout.tsx";
import BusinessPageContent from "@/shared/layouts/BusinessPageContent.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import {
    TbChevronDown,
    TbDotsVertical, TbList,
    TbPencilBolt,
    TbPlus,
    TbTrash, TbX
} from "react-icons/tb";
import ContentList, { type DisplayMode } from "@/shared/layouts/ContentList.tsx";
import { useEffect, useMemo, useState } from "react";
import useLandingPages from "@/modules/landing-page/api/useLandingPages.ts";
import SimpleTable from "@/shared/components/table/SimpleTable.tsx";
import type { LandingPageItem } from "@/modules/landing-page/types/landing-page-types.ts";
import { CardBody, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@heroui/react";
import { NavLink, useParams } from "react-router-dom";
import Card from "@/shared/design-system/card/Card.tsx";
import useDate from "@/shared/hooks/useDate.ts";
import useAddLandingPageModal from "@/modules/landing-page/hooks/useAddLandingPageModal.tsx";
import useEditLandingPageModal from "@/modules/landing-page/hooks/useEditLandingPageModal.tsx";
import useDeleteLandingPageModal from "@/modules/landing-page/hooks/useDeleteLandingPageModal.tsx";
import SharedImage from "@/shared/components/image/SharedImage";

const displayModes = [
    {
        key: 'list',
        label: 'List',
        icon: <TbList className={'size-5'}/>,
    },
]

const sortBy = [
    {key: 'createdAt-desc', label: 'Newest Landing Pages'},
    {key: 'createdAt-asc', label: 'Oldest Landing Pages'},
]

export default function LandingPageList() {
    const date = useDate()
    const [mode, setMode] = useState<DisplayMode>(displayModes[0])
    const [currentLandingPages, setCurrentLandingPages] = useState<LandingPageItem[]>([])
    const landingPages = useLandingPages()
    const addLandingPageModal = useAddLandingPageModal()
    const editLandingPageModal = useEditLandingPageModal()
    const deleteLandingPageModal = useDeleteLandingPageModal()
    const {businessId} = useParams()

    const selectedLandingPages = useMemo(() => {
        return currentLandingPages.filter(landingPage => landingPage.isChecked)
    }, [currentLandingPages])

    const clearSelected = () => {
        setCurrentLandingPages(prevState => prevState.map(item => ({
            ...item,
            isChecked: false
        })))
    }

    useEffect(() => {
        if (landingPages.data?.items) {
            setCurrentLandingPages(landingPages.data.items.map((landingPage: LandingPageItem) => ({
                ...landingPage,
                isChecked: false
            })))
        }
    }, [landingPages.data?.items])

    return (
        <BusinessLayout pageTitle="Landing Pages" menuActive="landing-page">
            <BusinessPageContent
                title={'Landing Pages'} 
                actions={
                    <Button
                        key={'add-landing-page'}
                        startContent={<TbPlus className={'size-5'}/>}
                        onPress={addLandingPageModal.onOpen}
                    >
                        Add Landing Page
                    </Button>
                }
            > 

                <ContentList
                    stickyTop={0}
                    list={<div className={'space-y-6'}>
                        <SimpleTable
                            stickyTop={53}
                            columns={[
                                {
                                    key: 'title',
                                    label: 'Title',
                                    size: 25
                                }, 
                                {
                                    key: 'products',
                                    label: 'Products',
                                    size: 30
                                }, 
                                {
                                    key: 'updatedAt',
                                    label: 'Last Updated',
                                    size: 10,
                                    isSortable: true,
                                },
                            ]}
                            rows={currentLandingPages.map((item, i) => ({
                                _checkbox: {
                                    value: (<Checkbox isSelected={Boolean(item.isChecked)}
                                                      onChange={() => setCurrentLandingPages(prevState => prevState.map((val, index) => index === i ? {
                                                          ...val,
                                                          isChecked: !val.isChecked
                                                      } : val))}/>) 
                                },
                                title: {
                                    value: (
                                        <div className={'min-h-[60px]'}> 

                                            {/* S: Title and Actions */}
                                            <div className={'grid grid-rows-[auto_1fr] w-full'}>

                                                {/* S: Title */}
                                                <div className={'flex items-center gap-1.5 pt-0.5'}>
                                                    <NavLink
                                                        to={`/${businessId}/courses/${item.id}/overview`}
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
                                                        Test
                                                    </div>
                                                    <div
                                                        className={'absolute left-0 top-0 group-hover:opacity-100 opacity-0 flex items-center gap-1 ms-[-6px]'}>
                                                        <Tooltip placement={'bottom'} content={'Quick edit'}>
                                                            <Button color={'default'} size={'sm'} variant={'light'}
                                                                    className={'rounded-full'} isIconOnly
                                                                    onPress={() => {
                                                                        editLandingPageModal.onOpen(item)
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
                                                                    deleteLandingPageModal.setItem(item)
                                                                    deleteLandingPageModal.onOpen()
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
                                type: {
                                    value: (
                                        <div className={'text-default-500 text-sm pt-0.5 capitalize'}>
                                            {item.type || 'default'}
                                        </div>
                                    ),
                                },
                                products: {
                                    value: (
                                        <div className={'text-default-500 text-sm pt-0.5'}>
                                            {item.landingPagePricings && item.landingPagePricings.length > 0 ? (
                                                <div className={'space-y-1'}>
                                                    {item.landingPagePricings.slice(0, 3).map((landingPagePricing, index) => (
                                                        <div key={index} className={'flex items-center gap-2'}>
                                                            <span className={'text-xs bg-default-100 px-2 py-1 rounded-full'}>
                                                                {landingPagePricing.pricing.title}
                                                            </span>
                                                            <span className={'text-xs text-default-400'}>
                                                                {landingPagePricing.pricing.currency} {landingPagePricing.pricing.price.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {item.landingPagePricings.length > 3 && (
                                                        <div className={'text-xs text-default-400'}>
                                                            +{item.landingPagePricings.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={'text-default-400'}>No products selected</span>
                                            )}
                                        </div>
                                    ),
                                },
                                description: {
                                    value: (
                                        <div className={'text-default-500 text-sm pt-0.5'}>
                                            {item.description || (
                                                <span className={'text-default-400'}>No description</span>
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
                                {selectedLandingPages.length > 0 && (
                                    <div
                                        className={'border-b border-default px-10 py-4 bg-primary text-foreground flex items-center justify-between gap-8'}>
                                        <div className="flex items-center gap-8">
                                            <div className={'font-light border-r border-white2 pe-8 py-2'}>
                                                {selectedLandingPages.length} selected
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
                                                    <DropdownMenu onAction={(action) => {
                                                        if (action === 'delete') {
                                                            // Handle bulk delete
                                                            deleteLandingPageModal.onOpen()
                                                            deleteLandingPageModal.setTitle(`Delete ${selectedLandingPages.length} Landing Pages`)
                                                            deleteLandingPageModal.setContent(`Are you sure you want to delete ${selectedLandingPages.length} landing pages? This action cannot be undone.`)
                                                        }
                                                    }}>
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
                                    isSelected={currentLandingPages.length > 0 && currentLandingPages.every(landingPage => landingPage.isChecked)}
                                    onChange={() => {
                                        setCurrentLandingPages(prevState => prevState.map(item => ({
                                            ...item,
                                            isChecked: selectedLandingPages.length < currentLandingPages.length
                                        })))
                                    }}/>
                            </>}
                            isLoading={landingPages.isLoading}
                        />

                    </div>}
                    filters={[
                        {
                            key: 'type',
                            label: 'Type',
                            type: 'choices',
                            choices: [
                                {
                                    key: 'default',
                                    label: 'Default',
                                },
                                {
                                    key: 'home',
                                    label: 'Home',
                                },
                            ]
                        },
                    ]}
                    sortBy={sortBy}
                    displayModes={displayModes}
                    activeMode={mode}
                    setActiveMode={(mode) => setMode(mode as DisplayMode)}
                    data={landingPages.data}
                    isLoading={landingPages.isRefetching}
                />

                {addLandingPageModal.Element}
                {editLandingPageModal.Element}
                {deleteLandingPageModal.Element}

            </BusinessPageContent>

        </BusinessLayout>
    )
}