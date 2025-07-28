import {TbSearch} from "react-icons/tb";
import TextField from "@/shared/design-system/form/TextField.tsx";
import {useForm} from "react-hook-form";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

export default function SimpleSearch(props?: {
    label?: string;
}) {
    const [query, setQuery] = useSearchParams()

    // search
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

    // search form
    const searchForm = useForm<{ search: string }>()
    const searchValue = searchForm.watch('search')

    const search = query.get('search')
    useEffect(() => {
        if(search) {
            searchForm.setValue('search', search || '')
        }
    }, [search]);

    return (
        <TextField
            fullWidth
            startContent={<TbSearch className="size-5 me-0.5"/>}
            placeholder={props?.label || 'Search '}
            {...searchForm.register('search')}
            value={searchValue}
            onValueChange={(value) => {
                if(searchTimeout) {
                    clearTimeout(searchTimeout)
                }

                setSearchTimeout(setTimeout(() => {
                    if(value) {
                        query.delete('page')
                        query.set('search', value)
                        setQuery(query)
                    }
                }, 500))
            }}
            variant={'underlined'}
            classNames={{
                innerWrapper: 'pb-0',
                inputWrapper: 'border-none shadow-none'
            }}
            onBlur={() => {
                if(searchValue === '') {
                    query.set('search', '')
                    setQuery(query)
                    searchForm.setValue('search', '')
                }
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    if(searchValue === '') {
                        query.set('search', '')
                        setQuery(query)
                        searchForm.setValue('search', '')
                    }
                }
            }}
            isClearable
            onClear={() => {
                query.set('search', '')
                setQuery(query)
                searchForm.setValue('search', '')
            }}
        />
    )
}