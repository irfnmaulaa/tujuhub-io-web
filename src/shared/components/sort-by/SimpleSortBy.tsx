import {useSearchParams} from "react-router-dom";
import {type JSX, useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import Button from "@/shared/design-system/button/Button.tsx";
import {TbSelector} from "react-icons/tb";

export type SortByItem = {
    key: string;
    label: string | JSX.Element;
}

export default function SimpleSortBy({ items }: {
    items: SortByItem[]
}) {
    const [query, setQuery] = useSearchParams()

    // search
    const [sortByTimeout, setSortByTimeout] = useState<NodeJS.Timeout>()

    // sortBy form
    const sortByForm = useForm<{ orderBy: string }>()

    const sortBy = query.get('orderBy')
    useEffect(() => {
        if(sortBy) {
            sortByForm.setValue('orderBy', sortBy || '')
        }
    }, [sortBy]);

    const selected = useMemo(() => {
        if(!sortBy) {
            return items[0]
        }
        return items.find(item => item.key === sortBy)
    }, [sortBy, items])

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button startContent={<TbSelector className={'size-5'}/>} variant={'light'}>
                    { selected?.label || 'Order By' }
                </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => {
                const value = key as string
                if(sortByTimeout) {
                    clearTimeout(sortByTimeout)
                }

                setSortByTimeout(setTimeout(() => {
                    if(value) {
                        query.delete('page')
                        query.set('orderBy', value)
                        setQuery(query)
                    }
                }, 500))
            }}>
                { items.map(item => (
                    <DropdownItem key={item.key}>
                        {item.label}
                    </DropdownItem>
                )) }
            </DropdownMenu>
        </Dropdown>
    )
}