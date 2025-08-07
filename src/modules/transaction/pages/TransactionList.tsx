import { useState, useEffect, useMemo, type JSX } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { TbList, TbPlus, TbEdit, TbTrash, TbChevronDown, TbUpload, TbFileDots, TbX, TbPencilBolt, TbUser, TbEye, TbCopy, TbExternalLink, TbLink, TbFileInvoice } from 'react-icons/tb';
import { CardBody, Checkbox, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@heroui/react';
import BusinessLayout from '@/shared/layouts/BusinessLayout.tsx';
import useDate from '@/shared/hooks/useDate.ts';
import type { TransactionItem } from '../types/transaction-type';
import useTransactions from '../api/useTransactions';
import useAddTransactionModal from '../hooks/useAddTransactionModal';
import useEditTransactionModal from '../hooks/useEditTransactionModal';
import useDeleteTransactionModal from '../hooks/useDeleteTransactionModal';
import useBulkTransactionAction from '../hooks/useBulkTransactionAction';
import BusinessPageContent from '@/shared/layouts/BusinessPageContent';
import Button from '@/shared/design-system/button/Button';
import ContentList from '@/shared/layouts/ContentList';
import SimpleTable from '@/shared/components/table/SimpleTable';
import Card from '@/shared/design-system/card/Card';
import SharedImage from '@/shared/components/image/SharedImage';
import { copyText } from '@/shared/utils/clipboard';

type DisplayMode = {
    key: string;
    label: string;
    icon: JSX.Element;
}

const displayModes: DisplayMode[] = [
    {
        key: 'list',
        label: 'List',
        icon: <TbList className={'size-5'}/>,
    },
]

const sortBy = [
    {key: 'createdAt-desc', label: 'Newest Transactions'},
    {key: 'createdAt-asc', label: 'Oldest Transactions'},
]

export default function TransactionList() {

    // define hooks
    const {businessId} = useParams()
    const date = useDate()

    // define state
    const [mode, setMode] = useState<DisplayMode | null>(displayModes[0])
    const [currentTransactions, setCurrentTransactions] = useState<TransactionItem[]>([])

    // define queries
    const transactions = useTransactions()

    // define modals
    const createTransactionModal = useAddTransactionModal()
    const editTransactionModal = useEditTransactionModal()
    const deleteTransactionModal = useDeleteTransactionModal()
    const bulkAction = useBulkTransactionAction()

    // define computed
    const selectedTransactions = useMemo(() => {
        return currentTransactions.filter(transaction => transaction.isChecked)
    }, [currentTransactions])

    const clearSelected = () => {
        setCurrentTransactions(prevState => prevState.map(transaction => ({...transaction, isChecked: false})))
    }

    useEffect(() => {
        if(transactions.data) {
            setCurrentTransactions(transactions.data.items)
        }
    }, [transactions.data]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-success'
            case 'pending': return 'text-warning'
            case 'expired': return 'text-danger'
            default: return 'text-default-500'
        }
    }

    const formatCurrency = (amount: number, currency: string = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <BusinessLayout
            pageTitle={'Transactions'}
            menuActive={'transaction'}
        >
            <BusinessPageContent
                title={'Transactions'}
                actions={
                    <Button startContent={<div>
                        <TbPlus className="size-5 me-[-5px]"/>
                    </div>} onPress={() => {
                        createTransactionModal.onOpen()
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
                            defaultSortBy={'createdAt-desc'}
                            columns={[
                                {
                                    key: 'customer',
                                    label: 'Customer',
                                    size: 3,
                                    isSortable: false,
                                }, 
                                {
                                    key: 'products',
                                    label: 'Products',
                                    size: 2,
                                    isSortable: false,
                                },
                                {
                                    key: 'amount',
                                    label: 'Amount',
                                    size: 1,
                                    isSortable: false,
                                },
                                {
                                    key: 'status',
                                    label: 'Status',
                                    size: 1,
                                    isSortable: true,
                                },
                                {
                                    key: 'provider',
                                    label: 'Provider',
                                    size: 1,
                                    isSortable: false,
                                },
                                {
                                    key: 'createdAt',
                                    label: 'Created',
                                    size: 1,
                                    isSortable: true,
                                }, 
                            ]}
                            rows={currentTransactions.map((item, i) => ({
                                _checkbox: {
                                    value: (<Checkbox isSelected={Boolean(item.isChecked)}
                                    onChange={() => setCurrentTransactions(prevState => prevState.map((val, index) => index === i ? {
                                        ...val,
                                        isChecked: !val.isChecked
                                    } : val))}/>)
                                },
                                customer: {
                                    value: (
                                        <div className={'grid grid-cols-[auto_1fr] gap-5'}>

                                            {/* S: Thumbnail */}
                                            <div>
                                                <NavLink to={`/${businessId}/users/${item.id}`}>
                                                    <SharedImage 
                                                        src={item.user?.picture || ''}
                                                        radius={'full'}
                                                        fallbackElement={<TbUser className="w-[40%] h-[40%]"/>}
                                                        className={'aspect-[1/1] h-[55px]'} 
                                                    />
                                                </NavLink>
                                            </div>
                                            {/* E: Thumbnail */}

                                            {/* S: Title and Actions */}
                                            <div className={'grid grid-rows-[auto_1fr] w-full'}>

                                                {/* S: Title */}
                                                <div className={'flex items-center gap-1.5 pt-0.5'}>
                                                    <NavLink
                                                        to={`/${businessId}/courses/${item.id}/overview`}
                                                        className={'hover:underline line-clamp-1'}>
                                                        {item.user?.firstName || 'Unknown user'} {item.user?.lastName || ''} 
                                                    </NavLink>
                                                </div>
                                                {/* E: Title */}

                                                {/* S: Actions */}
                                                <div className={'relative pt-0.5'}>
                                                    <div
                                                        className={'group-hover:hidden text-default-500 text-sm line-clamp-1'}>
                                                        {item.user?.email} 
                                                    </div>
                                                    <div
                                                        className={'absolute left-0 top-0 group-hover:opacity-100 opacity-0 flex items-center gap-1 ms-[-6px]'}>
                                                        <Tooltip placement={'bottom'} content={'View user details'}>
                                                            <Button color={'default'} size={'sm'} variant={'light'}
                                                                    className={'rounded-full'} isIconOnly
                                                                    onPress={() => {
                                                                        editTransactionModal.setItem(item)
                                                                        editTransactionModal.onOpen()
                                                                    }}>
                                                                <TbUser className={'size-5'}/>
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip placement={'bottom'} content={'Quick edit'}>
                                                            <Button color={'default'} size={'sm'} variant={'light'}
                                                                    className={'rounded-full'} isIconOnly
                                                                    onPress={() => {
                                                                        editTransactionModal.setItem(item)
                                                                        editTransactionModal.onOpen()
                                                                    }}>
                                                                <TbPencilBolt className={'size-5'}/>
                                                            </Button>
                                                        </Tooltip> 
                                                        
                                                        {item.provider === 'xendit' && item.providerXenditInvoice?.invoice_url && (
                                                            <Tooltip placement={'bottom'} content={'Open Invoice'}>
                                                                <Button color={'default'} size={'sm'} variant={'light'}
                                                                        className={'rounded-full'} isIconOnly
                                                                        onPress={() => {
                                                                            window.open(item.providerXenditInvoice?.invoice_url || '', '_blank')
                                                                        }}>
                                                                    <TbFileInvoice className={'size-5'}/>
                                                                </Button>
                                                            </Tooltip> 
                                                        )} 
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
                                        <div className={'text-default-500 text-sm'}>
                                            {item.transactionPricings && item.transactionPricings.length > 0 ? (
                                                <div className={'grid gap-1'}>
                                                    {item.transactionPricings.slice(0, 2).map((tp, index) => (
                                                        <div key={tp.id}>
                                                            {tp.pricing?.title} {tp.quantity > 1 && `(${tp.quantity}x)`}
                                                        </div>
                                                    ))}
                                                    {item.transactionPricings.length > 2 && (
                                                        <div className={'text-xs text-default-400'}>
                                                            +{item.transactionPricings.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={'text-default-400'}>No products</span>
                                            )}
                                        </div>
                                    ),
                                },
                                amount: {
                                    value: (
                                        <div className={'font-medium'}>
                                            {formatCurrency(item.finalAmount, item.currency)}
                                        </div>
                                    ),
                                },
                                status: {
                                    value: (
                                        <div className={`capitalize font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </div>
                                    ),
                                },
                                provider: {
                                    value: (
                                        <div className={'capitalize text-sm text-default-500'}>
                                            {item.provider}
                                        </div>
                                    ),
                                },
                                createdAt: {
                                    value: <div
                                        className={'font-light text-default-500 text-sm'}>{date.create(item.createdAt || item.createdAt).format('D MMM YYYY')}</div>,
                                }, 
                            }))} 
                            bulk={<>
                                {selectedTransactions.length > 0 && (
                                    <div
                                        className={'border-b border-default px-10 py-4 bg-primary text-foreground flex items-center justify-between gap-8'}>
                                        <div className="flex items-center gap-8">
                                            <div className={'font-light border-r border-white2 pe-8 py-2'}>
                                                {selectedTransactions.length} selected
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
                                                        items: selectedTransactions,
                                                        action
                                                    })}>
                                                        <DropdownItem
                                                            startContent={<TbUpload className={'size-5'}/>}
                                                            key={'mark-completed'}>Mark as Completed</DropdownItem>
                                                        <DropdownItem
                                                            startContent={<TbFileDots className={'size-5'}/>}
                                                            key={'mark-pending'}>Mark as Pending</DropdownItem>
                                                        <DropdownItem
                                                            startContent={<TbFileDots className={'size-5'}/>}
                                                            key={'mark-expired'} showDivider>Mark as Expired</DropdownItem>
                                                        <DropdownItem className={'text-red-500'}
                                                                      startContent={<TbTrash className={'size-5'}/>}
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
                                    isSelected={currentTransactions.length > 0 && currentTransactions.every(course => course.isChecked)}
                                    onChange={() => {
                                        setCurrentTransactions(prevState => prevState.map(item => ({
                                            ...item,
                                            isChecked: selectedTransactions.length < currentTransactions.length
                                        })))
                                    }}/>
                            </>}
                            isLoading={transactions.isLoading}
                        />
                    </div>}

                    filters={[
                        { 
                            key: 'status',
                            label: 'Status',
                            type: 'choices',
                            choices: [
                                {
                                    key: 'pending',
                                    label: 'Pending',
                                },
                                {
                                    key: 'completed',
                                    label: 'Completed',
                                },
                                {
                                    key: 'expired',
                                    label: 'Expired',
                                },
                            ]
                        },
                    ]}
                    sortBy={sortBy}
                    displayModes={displayModes}
                    activeMode={mode}
                    setActiveMode={(mode) => setMode(mode)}
                    data={transactions.data}
                    isLoading={transactions.isRefetching}
                />

                {createTransactionModal.Element}
                {editTransactionModal.Element}
                {deleteTransactionModal.Element}

            </BusinessPageContent>
        </BusinessLayout>
    )
}