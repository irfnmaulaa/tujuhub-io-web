import {type JSX, useState} from "react";
import {ButtonGroup, useDisclosure, type UseDisclosureProps} from "@heroui/react";
import {ModalElement} from "@/shared/hooks/useModal.tsx";
import Button from "@/shared/design-system/button/Button.tsx";
import {useSearchParams} from "react-router-dom";

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
    isDisabled?: boolean;
}

export function FilterElement({ control, filters }: {
    control: UseDisclosureProps;
    filters?: Filter[]
}) {

    const [query, setQuery] = useSearchParams()
    const [appliedFilters, setAppliedFilters] = useState<{[filterKey: string]: FilterChoice[]}>({});

    const updateFilter = (filter: Filter, value: FilterChoice) => {
        setAppliedFilters(prevState => {
            return {
                ...prevState,
                [filter.key]: prevState[filter.key]?.find(val => val.key === value.key) ? prevState[filter.key].filter(val => val.key !== value.key)  : prevState[filter.key] ? [...prevState[filter.key], value] : [value]
            }
        })
    }

    const applyFilter = () => {
        if(Object.values(appliedFilters).flat().length > 0){
            Object.keys(appliedFilters).forEach(key => {
                const values = appliedFilters[key]
                if(values.length > 0) {
                    query.set(key, values.map(val => val.key).join())
                    setQuery(query)
                } else {
                    query.delete(key)
                    setQuery(query)
                }
            })
        } else {
            filters?.map(filter => {
                query.delete(filter.key)
                setQuery(query)
            })
        }

        control?.onClose?.()
    }

    return (
        <ModalElement
            control={control}
            header={'Filter'}
            footer={<div className={'flex w-full justify-between mt-5'}>
                <div>
                    { Object.values(appliedFilters).flat().length > 0 && (
                        <Button variant={'bordered'} color={'danger'} size={'lg'} onPress={() => {
                            setAppliedFilters({})
                        }}>
                            Reset to default
                        </Button>
                    ) }
                </div>
                <div className={'flex gap-2'}>
                    <Button color={'default'} variant={'light'} size={'lg'} onPress={() => {
                        control?.onClose?.()
                    }}>
                        Cancel
                    </Button>
                    <Button size={'lg'} onPress={applyFilter}>
                        Apply
                    </Button>
                </div>
            </div>}
        >
            {filters?.map(filter => (
                <div key={filter.key}>
                    {filter.type === 'choices' ? (
                        <>
                            <div className={'mb-1.5'}>{filter.label}</div>
                            <ButtonGroup>
                                <Button color={(!appliedFilters[filter.key] || appliedFilters[filter.key].length <= 0) ? 'primary' : 'default'} variant={'flat'} onPress={() => {
                                    setAppliedFilters(prevState => {
                                        if(prevState[filter.key]) {
                                            return {
                                                ...prevState,
                                                [filter.key]: []
                                            }
                                        }
                                        return prevState
                                    })
                                }}>
                                    All
                                </Button>
                                {filter.choices?.map(choice => {
                                    return (
                                        <Button color={appliedFilters[filter.key]?.find(val => val.key === choice.key) ? 'primary' : 'default'} variant={'flat'} onPress={() => {
                                            updateFilter(filter, choice)
                                        }}>
                                            {choice.label}
                                        </Button>
                                    )
                                })}
                            </ButtonGroup>
                        </>
                    ) : (
                        <div></div>
                    )}
                </div>
            ))}
        </ModalElement>
    )
}

export function useFilter() {
    return useDisclosure()
}