import {TbSearch, TbX} from "react-icons/tb";
import TextField from "@/shared/design-system/form/TextField.tsx";
import {useForm} from "react-hook-form";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "@/shared/design-system/button/Button.tsx";

export default function SimpleSearch(props?: {
    label?: string;
}) {
    const [query, setQuery] = useSearchParams()

    // search
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()
    const [isCleared, setIsCleared] = useState(true)

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
                        setIsCleared(false)
                    }
                }, 500))
            }}
            endContent={<>
                { (searchValue || !isCleared) && (
                   <>
                       <Button
                           isIconOnly
                           radius="full"
                           variant="light"
                           size="sm"
                           onPress={() => {
                               query.set('search', '')
                               setQuery(query)
                               searchForm.setValue('search', '')
                               setIsCleared(true)
                           }}
                       >
                           <TbX className="size-4"/>
                       </Button>
                   </>
                ) }
            </>}
            variant={'underlined'}
            classNames={{
                innerWrapper: 'pb-0',
                inputWrapper: 'border-none shadow-none'
            }}
        />
    )
}