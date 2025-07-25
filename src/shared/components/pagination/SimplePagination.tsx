import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip} from "@heroui/react";
import Button from "@/shared/design-system/button/Button.tsx";
import {cn} from "@heroui/theme";
import {TbChevronLeft, TbChevronRight} from "react-icons/tb";
import type {PaginationFields} from "@/shared/types/api-response.ts";
import {useSearchParams} from "react-router-dom";
import {displayFriendlyNumber} from "@/shared/utils/number.ts";

export default function SimplePagination({ data, isLoading = false, size = 'lg' }: {
    data: PaginationFields;
    isLoading?: boolean;
    size?: 'lg' | 'sm' | 'md'
}) {
    const [, setQuery] = useSearchParams()
    const searchParams = new URLSearchParams(window.location.search);
    return (
        <>
            {/* S: Pagination */}
            {data ? (
                <div className="flex justify-between gap-3 lg:flex-row flex-col-reverse items-center">
                    <div className="text-sm text-gray-500">Displaying <span className="font-semibold text-primary">{ data.filtered.count }</span> out of <span className="font-semibold text-primary">{ displayFriendlyNumber(data.total_count) }</span></div>
                    { data.pages_count > 1 && (
                        <div className="flex items-center">
                            <Dropdown placement="top">
                                <DropdownTrigger>
                                    <Button
                                        variant="light"
                                        size={size}
                                        isDisabled={isLoading}
                                    >
                                        {`${data.filtered.from+1} - ${data.filtered.to >= data.filtered.from + data.filtered.count ? data.filtered.from + data.filtered.count : data.filtered.to}`}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => {
                                    switch (key) {
                                        case 'newest':
                                            searchParams.set('page', '1')
                                            setQuery(searchParams)
                                            break;
                                        case 'oldest':
                                            searchParams.set('page', data.pages_count + '')
                                            setQuery(searchParams)
                                            break;
                                    }
                                }}>
                                    <DropdownItem key="newest"
                                                  className={cn(data.request.page <= 1 && 'bg-gray-100')}>Newest</DropdownItem>
                                    <DropdownItem key="oldest"
                                                  className={cn(data.request.page >= data.pages_count && 'bg-gray-100')}>Oldest</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Tooltip content="Newer">
                                <Button
                                    variant="light"
                                    size={size}
                                    isIconOnly
                                    className="rounded-full"
                                    isDisabled={data.current_page <= 1 || isLoading}
                                    onPress={() => {
                                        searchParams.set('page', (data.current_page - 1) + '')
                                        setQuery(searchParams)
                                    }}
                                >
                                    <TbChevronLeft className="size-5"/>
                                </Button>
                            </Tooltip>
                            <Tooltip content="Older">
                                <Button
                                    variant="light"
                                    size={size}
                                    isIconOnly
                                    className="rounded-full"
                                    isDisabled={data.is_last_page || isLoading}
                                    onPress={() => {
                                        searchParams.set('page', (data.current_page + 1) + '')
                                        setQuery(searchParams)
                                    }}
                                >
                                    <TbChevronRight className="size-5"/>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            ) : ''}
            {/* S: Pagination */}
        </>
    )
}