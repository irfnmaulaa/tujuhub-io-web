import Button from "@/shared/design-system/button/Button.tsx";
import {Divider, Tooltip} from "@heroui/react";
import {cx} from "class-variance-authority";

import SimpleAddFilters, {type Filter} from "@/shared/components/filter/SimpleAddFilters.tsx";
import type {SortByItem} from "@/shared/components/sort-by/SimpleSortBy.tsx";
import SimpleSearch from "@/shared/components/search/SimpleSearch.tsx";
import SimplePagination from "@/shared/components/pagination/SimplePagination.tsx";

import type {PaginationResponse} from "@/shared/types/api-response";
import useResponsive from "@/shared/hooks/useResponsive.ts";
import {TbArrowLeft} from "react-icons/tb";
import {NavLink, useParams} from "react-router-dom";
import type { JSX } from "react";

export type DisplayMode = {
    key: string;
    label: string;
    icon: JSX.Element;
}
export default function ContentList({ slotStart, isSticky = true, stickyTop = 53, slotEnd, title, subtitle, actions, filters, displayModes, activeMode, setActiveMode, data, list, isLoading, noPagination = false }: {
    title?: string;
    subtitle?: string;
    actions?: JSX.Element;
    filters?: Filter[];
    sortBy?: SortByItem[];
    displayModes?: DisplayMode[];
    activeMode?: DisplayMode | null,
    setActiveMode?: (activeMode: DisplayMode | null) => void;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    data?: PaginationResponse<any>;
    list?: JSX.Element;
    isLoading?: boolean;
    slotStart?: JSX.Element
    slotEnd?: JSX.Element
    noPagination?: boolean;
    isSticky?: boolean;
    stickyTop?: number;
}) {
    const {slug} = useParams()
    const {isInDesktop} = useResponsive()
    return (
        <div className="flex flex-col gap-3 lg:gap-0">

            {/* S: Title and Actions */}
            { title && (
                <>
                    {!isInDesktop && (
                        <div className={'mb-5'}>
                            <div className={'flex items-center gap-2 text-default-500 text-sm'}>
                                <NavLink to={`/${slug}/home`} className={'flex gap-2 items-center hover:underline'}>
                                    <TbArrowLeft className={'size-4'}/>
                                    <div>Home</div>
                                </NavLink>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-4">
                        <div>
                            <h3 className="font-heading text-2xl lg:text-3xl font-bold">{ title }</h3>
                            { subtitle && (
                                <div className="text-default-500 mt-1.5 lg:mt-2 text-sm lg:text-medium lg:leading-[28px]">{ subtitle }</div>
                            ) }
                        </div>
                        {actions}
                    </div>
                    <Divider className="mb-0.5 mt-0.5"/>
                </>
            ) }
            {/* S: Title and Actions */}

            {/* S: Search and Total */}
            <div className={cx(
                'grid lg:grid-cols-[auto_1fr_auto] items-center border-b border-default px-10 py-1.5 bg-background z-20',
                isSticky ? `sticky` : '',
            )} style={{
                top: `${stickyTop}px`
            }}>
                <div>
                    {slotStart}
                </div>
                <div className={'w-full grid grid-cols-[auto_1fr_auto] gap-2'}>
                    <div>
                        { filters && filters.length > 0 && (
                            <SimpleAddFilters filters={filters}/>
                        ) }
                    </div>
                    <SimpleSearch/>
                    { displayModes && displayModes.length > 1 && (
                        <div className={'hover:bg-default-100 rounded'}>
                            { displayModes.map(displayMode => (
                                <Tooltip key={displayMode.key} content={`Display as ${ displayMode.label }`} placement={'bottom'}>
                                    <Button isIconOnly variant={'light'} className={cx(displayMode.key === activeMode?.key ? 'bg-default-300 hover:bg-default-300' : '', 'rounded')} onPress={() => {
                                        setActiveMode?.(displayMode)
                                    }}>
                                        { displayMode.icon }
                                    </Button>
                                </Tooltip>
                            )) }
                        </div>
                    ) }
                </div>
                <div>
                    {slotEnd}
                </div>
            </div>
            {/* E: Search and Total */}

            {/* S: List Items */}
            <div className={cx(isLoading && 'opacity-50')}>
                { list }
            </div>
            {/* E: List Items */}

            {/* S: Pagination */}
            { data && !noPagination && (
                <div className="px-10 py-2"><SimplePagination data={data} isLoading={isLoading}/></div>
            ) }
            {/* E: Pagination */}

        </div>
    )
}