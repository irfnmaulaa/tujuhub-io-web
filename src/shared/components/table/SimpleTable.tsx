import {cx} from "class-variance-authority";
import {CardBody, Skeleton} from "@heroui/react";
import Card from "@/shared/design-system/card/Card.tsx";
import {TbArrowDown, TbArrowUp, TbSearchOff} from "react-icons/tb";
import {useSearchParams} from "react-router-dom";
import {cn} from "@heroui/theme";
import useResponsive from "@/shared/hooks/useResponsive.ts";
import type {JSX} from "react";

export default function SimpleTable({ selectAll, stickyTop = 108, bulk, columns, rows, defaultSortBy, isLoading, isSticky = true, noPaddingX, hideTableHeader = false }: {
    selectAll?: JSX.Element;
    bulk?: JSX.Element;
    columns: {
        label: string | JSX.Element;
        key: string;
        size: number;
        isSortable?: boolean;
        isHidden?: boolean;
    }[];
    rows: {
        [key: string]: {
            value: string | JSX.Element;
        }
    }[];
    defaultSortBy?: string;
    isLoading?: boolean;
    isSticky?: boolean;
    stickyTop?: number;
    noPaddingX?: boolean;
    hideTableHeader?: boolean;
}) {

    // define hooks
    const [query, setQuery] = useSearchParams()
    const sortBy = query.get('orderBy') || defaultSortBy
    const { isInDesktop } = useResponsive()

    return (
        <div className={cx(
            'simple-table flex flex-col',
        )}>
            {/* S: Table Header */}
            { !hideTableHeader && (
                <div className={cn(
                    'table-header items-center  border-b border-default text-default-500 bg-background z-20',
                    isSticky ? `sticky` : '',
                )} style={{
                    top: stickyTop + 'px'
                }}>
                    {bulk}
                    <div className={cn(
                        'py-2 px-10 font-semibold gap-4',
                        !noPaddingX ? 'px-10' : 'px-5'
                    )} style={{
                        display: 'grid',
                        gridTemplateColumns: `${selectAll ? 'auto' : ''} ${columns.filter((col, i) => !col.isHidden && (isInDesktop || i === 0)).map(col => col.size + 'fr').join(' ')}`
                    }}>

                        { selectAll && (
                            <div className={'min-w-0'}>
                                {selectAll}
                            </div>
                        ) }
                        {columns.filter((col, i) => !col.isHidden && (isInDesktop || i === 0)).map((col, i) => {
                            const sortKey = sortBy?.split('-')[0]
                            const sortValue = sortBy?.split('-')[1] || 'desc'

                            const isOrdered = sortKey === col.key
                            return (
                                <div key={i} className={'min-w-0'}>
                                    <Card key={col.key} className={'border-0 rounded-none'} isPressable={col.isSortable && !isLoading}
                                          onPress={() => {
                                              query.set('orderBy', `${col.key}-${sortValue === 'asc' ? 'desc' : 'asc'}`)
                                              setQuery(query)
                                          }}>
                                        <CardBody className={'p-0 flex items-center flex-row'}>
                                            {col.label}

                                            {isOrdered && (
                                                <>
                                                    {sortValue === 'asc' ? (
                                                        <TbArrowUp className={'size-5'}/>
                                                    ) : (
                                                        <TbArrowDown className={'size-5'}/>
                                                    )}
                                                </>
                                            )}
                                        </CardBody>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) }
            {/* E: Table Header */}

            {/* S: Table Body */}
            { !isLoading ? (
                <>
                    {rows.map((row, i) => (
                        <div key={i} className={cx(
                            'grid py-3 border-b border-default group hover:bg-default-50 gap-4',
                            !noPaddingX ? 'px-10' : 'px-5'
                        )} style={{
                            display: 'grid',
                            gridTemplateColumns: `${row['_checkbox'] ? 'auto' : ''} ${ columns.filter((col, i) => !col.isHidden && (isInDesktop || i === 0)).map(col => col.size + 'fr').join(' ') }`
                        }}>
                            { row['_checkbox'] && (
                                <label className={'cursor-pointer min-w-0'}>
                                    { row['_checkbox'].value  }
                                </label>
                            ) }

                            { columns.filter((col, i) => !col.isHidden && (isInDesktop || i === 0)).map((col) => row[col.key]).map((item, i) => (
                                <div key={i}>
                                    { item && (
                                        <div className={'min-w-0'}>{item.value}</div>
                                    ) }
                                </div>
                            )) }
                        </div>
                    )) }
                    { rows.length <= 0 && (
                        <div className={cn('border-b border-default px-10 py-5 text-default-500 flex items-center gap-2 text-sm', !noPaddingX ? 'px-10' : 'px-5')}>
                            <TbSearchOff className={'size-5'}/>
                            No records found.
                        </div>
                    ) }
                </>
            ) : (
                <>
                    { new Array(24).fill(1).map((_, i) => (
                        <div key={i} className={cx(
                            'items-center py-2.5 border-b border-default gap-[24px]',
                            !noPaddingX ? 'px-10' : 'px-5'
                        )} style={{
                            display: 'grid',
                            gridTemplateColumns: `auto ${columns.map(col => col.size + 'fr').join(' ')}`
                        }}>
                            <Skeleton className={'w-[20px] h-[20px] rounded bg-default-100'}></Skeleton>
                            {columns.map((col) => (
                                <Skeleton key={col.key} className={'rounded bg-default-100 h-[32px]'}></Skeleton>
                            ))}
                        </div>
                    )) }
                </>
            ) }
            {/* E: Table Body */}

        </div>
    )
}