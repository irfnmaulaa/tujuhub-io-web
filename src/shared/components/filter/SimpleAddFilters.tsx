import Button from "@/shared/design-system/button/Button.tsx";
import {TbChevronRight, TbCircle, TbCircleFilled, TbFilter} from "react-icons/tb";
import {
    CardBody,
    Chip,
    DateRangePicker,
    Divider,
    useDisclosure
} from "@heroui/react";
import Card from "@/shared/design-system/card/Card.tsx";
import {useEffect, useMemo, useState, type JSX} from "react";
import {cx} from "class-variance-authority";
import {useSearchParams} from "react-router-dom";
import useResponsive from "@/shared/hooks/useResponsive.ts";
import useDate from "@/shared/hooks/useDate.ts";
import {cn} from "@heroui/theme";
import {useDateRangeTemplates} from "@/shared/utils/date.ts";
import {ModalElement} from "@/shared/hooks/useModal.tsx";

type FilterType = 'choices' | 'date-range'

type FilterChoice = {
    key: string;
    label: JSX.Element | string;
}

export type Filter = {
    label: string;
    key: string;
    type: FilterType;
    choices?: FilterChoice[]
    is_disabled?: boolean;
}

export default function SimpleAddFilters({ filters }: {
    filters: Filter[]
}) {

    const { isInDesktop } = useResponsive()
    const date = useDate()
    const addFilterModal = useDisclosure()
    const [selectedFilter, setSelectedFilter] = useState<Filter|null>(null)
    const [selectedKeys, setSelectedKeys] = useState<{key: string; values: (FilterChoice)[];}[]>([])
    const [query, setQuery] = useSearchParams()

    // computed: values
    const values = useMemo(() => {
        return selectedFilter ? (selectedKeys.find(key => key.key === selectedFilter.key)?.values || []) : []
    }, [selectedKeys, selectedFilter])

    // computed: date_range
    const dateRange = useMemo(() => {
        if(values.length > 0) {
            const [start, end] = values[0].key?.split(',') || [null, null]
            return { start, end }
        }
        return {
            start: date.create().startOf('month').format('YYYY-MM-DD'),
            end: date.create().endOf('month').format('YYYY-MM-DD'),
        }
    }, [values, date])

    // computed: date_range template
    const dateRangeTemplates = useDateRangeTemplates()

    // methods: set date-range
    const setDateRange = (start: string, end: string) => {
        const date_range = `${ start },${ end }`
        const values = [
            { key: date_range, label: `${ date.create(start).format('DD MMM YYYY') } - ${ date.create(end).format('DD MMM YYYY') }` },
        ]

        if(selectedFilter) {
            setValues(selectedFilter.key, values)
        }
    }

    // methods: set value
    const setValues = (key: string, values: FilterChoice[]) => {
        setSelectedKeys(prevState => {
            const newState = [...prevState]
            const keyIndex = newState.findIndex(s => s.key === key)
            if (keyIndex > -1) {
                newState[keyIndex].values = values
            } else {
                newState.push({ key, values })
            }
            return newState
        })
    }

    // methods: apply filter
    const applyFilter = () => {
        if(selectedKeys.map(key => key.values).flat().length > 0){
            selectedKeys.forEach(key => {
                if(key.values.length > 0) {
                    query.set(key.key, key.values.map(val => val.key).join())
                    setQuery(query)
                } else {
                    query.delete(key.key)
                    setQuery(query)
                }
            })
        } else {
            filters.map(filter => {
                query.delete(filter.key)
                setQuery(query)
            })
        }
        addFilterModal.onClose()
    }

    useEffect(() => {
        const keys: {key: string; values: (FilterChoice)[];}[] = []
        for(const filter of filters) {
            const queryValues = query.get(filter.key)

            let values = queryValues ? queryValues.split(',').map(q => filter.choices?.find(choice => choice.key === q) as FilterChoice).filter(q => q) : []

            if(filter.type === 'date-range' && queryValues) {
                const start = queryValues.split(',')[0]
                const end = queryValues.split(',')[1]

                if(start && end) {
                    const label = `${ date.create(start).format('DD MMM YYYY') } - ${ date.create(end).format('DD MMM YYYY') }`
                    values = [
                        { key: queryValues, label }
                    ]
                }
            }

            keys.push({
                key: filter.key,
                values
            })
        }
        setSelectedKeys(keys)
    }, [filters]); 

    return (
        <>
            <Button startContent={<TbFilter className={'size-5'}/>} variant={'flat'} color={'default'} onPress={() => {
                addFilterModal.onOpen()
            }} endContent={<div>
                { selectedKeys.filter(key => key.values.length > 0).length > 0 && (
                    <Chip>
                        {selectedKeys.filter(key => key.values.length > 0).length} applied
                    </Chip>
                ) }
            </div>} isIconOnly={!isInDesktop}>
                { isInDesktop ? 'Filter' : '' }
            </Button>

            <ModalElement
                control={addFilterModal}
                size={'2xl'}
                header='Filter'
                footer={<div>
                    <div>
                        {selectedKeys.filter(key => key.values.length > 0).length > 0 && (
                            <Button variant={'light'} onPress={() => {
                                setSelectedKeys([])
                                setSelectedFilter(null)
                            }}>
                                Reset
                            </Button>
                        ) }
                    </div>
                    <div className={'flex items-center gap-3'}>
                        <Button color={'white'} onPress={addFilterModal.onClose}>
                            Cancel
                        </Button>
                        <Button onPress={applyFilter}>
                            Apply filter
                        </Button>
                    </div>
                </div>}
            >
                <div className={cx('border-none grid p-0 gap-0', selectedFilter ? 'grid-cols-[1fr_1.5fr]' : 'grid-cols-1')}>
                    <div className="p-4 flex flex-col gap-3">
                        <div className={'flex items-center justify-between'}>
                            <h4 className="font-medium">Filters</h4>
                            { selectedKeys.filter(key => key.values.length > 0).length > 0 && (
                                <Chip isCloseable onClose={() => {
                                    setSelectedKeys([])
                                    setSelectedFilter(null)
                                }}>
                                    {selectedKeys.filter(key => key.values.length > 0).length} applied
                                </Chip>
                            ) }
                        </div>
                        { filters.filter(filter => !filter.is_disabled).map(filter => {
                            const key = selectedKeys.find(key => key.key === filter.key)
                            return (
                                <Card key={filter.key} isPressable onPress={() => {
                                    setSelectedFilter(filter)
                                }} className={cx(selectedFilter?.key === filter.key ? 'border-primary' : '')}>
                                    <CardBody className={'p-2 px-4'}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {filter.label}
                                            </div>
                                            <TbChevronRight className={'size-5 text-gray-500'}/>
                                        </div>
                                        { key && key.values.length > 0 && (
                                            <div className={'flex flex-wrap gap-2 mt-2'}>
                                                { key.values.map(value => (
                                                    <Chip key={value.key} isCloseable onClose={() => {
                                                        const selectedKey = selectedKeys.find(key => key.key === filter.key)
                                                        if(selectedKey) {
                                                            setValues(filter.key, selectedKey.values.filter(val => val.key !== value.key))
                                                        }
                                                    }}>
                                                        {value.label}
                                                    </Chip>
                                                ))}
                                            </div>
                                        ) }
                                    </CardBody>
                                </Card>
                            )
                        }) }
                    </div>
                    { selectedFilter && (
                        <div className="border-l border-default p-4 flex flex-col gap-3">
                            <div>
                                <h4 className="font-medium">{selectedFilter.label}</h4>
                            </div>

                            <Divider className={'mb-1'}/>

                            <div className="flex flex-col gap-2">
                                { selectedFilter.type === 'choices' ? (
                                    <>
                                        { selectedFilter.choices?.map(choice => {
                                            const keyIndex = selectedKeys.findIndex(key => key.key === selectedFilter?.key)
                                            const isSelected = keyIndex > -1 && selectedKeys[keyIndex].values.findIndex(val => val.key === choice.key) > -1
                                            return (
                                                <Card key={choice.key} isPressable onPress={() => {
                                                    setSelectedKeys(prevState => {
                                                        const newState = [...prevState]
                                                        const keyIndex = newState.findIndex(key => key.key === selectedFilter?.key)
                                                        if(keyIndex > -1) {
                                                            const valueIndex = newState[keyIndex].values.findIndex(val => val.key === choice.key)
                                                            newState[keyIndex].values = valueIndex > -1 ? newState[keyIndex].values.filter(val => val.key !== choice.key) : [...newState[keyIndex].values, choice]
                                                        } else {
                                                            newState.push({
                                                                key: selectedFilter?.key || '',
                                                                values: [choice]
                                                            })
                                                        }
                                                        return newState
                                                    })
                                                }}>
                                                    <CardBody className={'p-2 text-sm px-3 flex-row gap-2 font-semibold items-center'}>
                                                        { isSelected ? (
                                                            <TbCircleFilled className={'size-4'}/>
                                                        ) : (
                                                            <TbCircle className={'size-4'}/>
                                                        ) }

                                                        { choice.label }
                                                    </CardBody>
                                                </Card>
                                            )
                                        }) }
                                    </>
                                ) : selectedFilter.type === 'date-range' ? (
                                    <>
                                        <DateRangePicker variant={'bordered'} value={{
                                            start: date.toDateValue(dateRange.start),
                                            end: date.toDateValue(dateRange.end),
                                        }} onChange={(e) => {
                                            if(e?.start && e?.end) {
                                                const start = date.toDateString(e.start)
                                                const end   = date.toDateString(e.end)
                                                setDateRange(start, end)
                                            }
                                        }}/>

                                        <div className={'mt-3 flex gap-1.5 flex-wrap'}>
                                            { dateRangeTemplates.map((template, i) => (
                                                <Button key={i} size={'sm'} variant={'light'} className={cn(
                                                    'border border-gray-500 rounded-full',
                                                    dateRange.start === template.start && dateRange.end === template.end ? 'bg-gray-300 text-primary border-primary' : 'text-gray-500'
                                                )} onPress={() => {
                                                    setDateRange(template.start, template.end)
                                                }}>
                                                    {template.label}
                                                </Button>
                                            )) }
                                        </div>
                                    </>
                                ) : '' }
                            </div>
                        </div>
                    ) }
                </div>
            </ModalElement>
        </>
    )
}