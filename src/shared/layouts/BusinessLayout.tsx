import {
    Avatar,
    cn,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Popover, PopoverContent,
    PopoverTrigger, Skeleton, Spinner, useDisclosure
} from "@heroui/react"
import Button from "@/shared/design-system/button/Button.tsx";
import {
    TbBell,
    TbBox,
    TbChevronDown,
    TbChevronRight,
    TbLogout,
    TbMenu2, TbMoon, TbPlus,
    TbSun,
    TbUserCircle
} from "react-icons/tb";
import {NavLink, useNavigate} from "react-router-dom";
import useProfile from "@/modules/profile/api/useProfile.ts";
import {Fragment, type Key, type PropsWithChildren, useEffect, useRef, useState} from "react";
import usePersonalInfo from "@/modules/profile/hooks/usePersonalInfo.tsx";
import {useLogout} from "@/modules/auth/api/useLogout.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useTheme from "@/shared/hooks/useTheme.ts";
import useMenus, {type MenuKeys} from "@/shared/hooks/useMenus.tsx";
import {useDetailBusiness} from "@/modules/business/api/useDetailBusiness.ts";
import useBusinesses from "@/modules/business/api/useBusinesses.ts";
import Card from "@/shared/design-system/card/Card.tsx";
import useCreateBusinessModal from "@/modules/business/hooks/useCreateBusinessModal.tsx";

export default function BusinessLayout({ children, pageTitle, menuActive }: PropsWithChildren & {
    pageTitle: string;
    menuActive: MenuKeys
}) {

    // define hooks
    const personalInfo = usePersonalInfo()
    const navigate = useNavigate()
    const { menus } = useMenus()

    // define modals
    const businessDropdown = useDisclosure()
    const createBusinessModal = useCreateBusinessModal()

    // define queries
    const profile = useProfile()
    const business = useDetailBusiness()
    const businesses = useBusinesses()

    // define mutations
    const logout = useLogout({
        onSettled: () => {
            toastSuccess('Logged out successful', { dismissBefore: true })
            setTimeout(() => {
                navigate('/sign-in')
            }, 1000)
        }
    })

    // define state
    const [isCollapsed, setCollapsed] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme()

    // define profile action
    const profileAction = async (key: Key) => {
        if(key === 'logout') {
            await logout.mutateAsync({})
        }
    }

    useEffect(() => {
        document.title = `${pageTitle} · ${import.meta.env.VITE_APP_NAME}`
    }, [pageTitle]);

    if(profile.isLoading || !profile.data) {
        return (<div></div>)
    }

    return (
        <div>
            {/* S: Navbar */}
            <header
                className={'navbar relative h-[65px] p-3 ps-5 pe-7 flex items-center justify-between border-b border-t border-default-200'}>
                <div className={'flex items-center gap-3'}>
                    <Button variant={'flat'} color={'default'} isIconOnly className={'rounded-full'}
                            onPress={() => setCollapsed(prevState => !prevState)}>
                        <TbMenu2 className={'size-6'}/>
                    </Button>

                    <NavLink to={`/`}
                             className={'flex items-center gap-1.5 font-medium tracking-[-0.5px] font-heading text-[22px]'}>
                        <img src="/img/logo.png" alt="logo" className={'h-[30px] logo'}/>
                    </NavLink>
                </div>
                <div className="flex items-center gap-12">


                    <div className="flex items-center gap-3">

                        <Button isIconOnly variant={'flat'} color={'default'} radius={'full'}><TbBell className={'size-5'}/></Button>


                        <Button isIconOnly variant={'flat'} color={'default'} radius={'full'} onPress={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark')
                        }}>
                            { theme === 'light' ? (
                                <TbMoon className={'size-5'}/>
                            ) : (
                                <TbSun className={'size-5'}/>
                            ) }
                        </Button>

                    </div>
                    <Dropdown placement="bottom-end" showArrow>
                        <DropdownTrigger>
                            { personalInfo.getAvatar({
                                user: profile.data
                            }) }
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={profileAction}>
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{profile.data.email}</p>
                            </DropdownItem>

                            <DropdownItem startContent={<TbBox className={'size-5'}/>} key="my-businesses">My
                                Businesses</DropdownItem>
                            <DropdownItem startContent={<TbUserCircle className={'size-5'}/>} key="profile">My
                                Profile</DropdownItem>
                            <DropdownItem startContent={<TbLogout className={'size-5'}/>} key="logout"
                                          className={'text-red-500'}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </header>
            {/* E: Navbar */}

            <div
                className={cn(
                    'w-[100vw] h-[calc(100vh_-_65px)] grid overflow-visible',
                )}
                style={{
                    gridTemplateColumns: `${isCollapsed ? '80px' : '280px'} 1fr`,
                    transition: 'all .3s ease-in-out',
                }}
            >

                {/* S: Sidebar */}
                <aside
                    className={'h-[calc(100vh_-_65px)] w-full p-3 relative border-r border-default-200 flex flex-col justify-between overflow-y-auto'}>
                    <div>

                        {!business.isLoading && business.data ? (
                            <Popover
                                backdrop="opaque"
                                placement="bottom-start"
                                isOpen={businessDropdown.isOpen}
                                onOpenChange={businessDropdown.onOpenChange}
                            >
                                <PopoverTrigger>
                                    <Card
                                        isPressable
                                        className={cn(
                                            'w-full border border-default text-left grid grid-cols-[1fr_auto] gap-2.5 items-center hover:bg-default-100 whitespace-nowrap rounded-lg p-3 font-medium relative group mt-3 mb-5',
                                        )}
                                    >
                                        <div className="grid grid-cols-[30px_1fr] gap-2.5 items-center">
                                            { business.data.logoSrc ? (
                                                <Avatar
                                                    className="bg-transparent transition-transform rounded-full lg:w-[30px] lg:h-[30px]"
                                                    src={business.data.logoSrc}
                                                />
                                            ) : (
                                                <Avatar
                                                    className="bg-transparent transition-transform rounded-full lg:w-[30px] lg:h-[30px]"
                                                    src={`https://eu.ui-avatars.com/api/?name=${business.data.name}&size=250`}
                                                />
                                            ) }

                                            {business.data.name}
                                        </div>
                                        <div>
                                            <TbChevronDown className="size-5"/>
                                        </div>
                                    </Card>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="rounded-lg w-full p-0 max-w-[500px] text-left max-h-[500px] items-start justify-start overflow-auto">

                                    <div className="p-3 pb-2 w-full font-medium">
                                        My businesses
                                    </div>

                                    {!businesses.isLoading && businesses.data ? (
                                        <>
                                            {businesses.data.items.map(business => (
                                                <Card isPressable onPress={() => {
                                                    navigate(`/${business.id}`)
                                                    businessDropdown.onClose()
                                                }} key={business.id} className="p-3 border-none hover:bg-default-100 overflow-visible text-left rounded-none w-full grid grid-cols-[30px_1fr] items-center gap-3 pe-24">
                                                    <div
                                                        className="w-full aspect-[1/1] flex items-center justify-center rounded-full overflow-hidden border border-default-500">
                                                        { business.logoSrc ? (
                                                            <Avatar
                                                                className="bg-transparent transition-transform rounded-full lg:w-[30px] lg:h-[30px]"
                                                                src={business.logoSrc}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                className="bg-transparent transition-transform rounded-full lg:w-[30px] lg:h-[30px]"
                                                                src={`https://eu.ui-avatars.com/api/?name=${business.name}&size=250`}
                                                            />
                                                        ) }
                                                    </div>
                                                    <div>
                                                        {business.name}
                                                    </div>
                                                </Card>
                                            ))}
                                        </>
                                    ) : (
                                        <div><Spinner variant={'simple'}/></div>
                                    )}

                                    <div className="p-3 w-full">
                                        <Button fullWidth variant={'flat'} startContent={<TbPlus className={'size-4'}/>} onPress={() => {
                                            createBusinessModal.onOpen()
                                            businessDropdown.onClose()
                                        }}>
                                            Create new business
                                        </Button>
                                    </div>

                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Skeleton className={'w-full h-[55px] rounded-lg mt-3 mb-5'}/>
                        )}

                        { menus.filter(menu => !menu.isBottomMenu).map((menu, i) => (
                            <div key={i}>
                                { menu.children ? (
                                    <div key={menu.path}>
                                        <input type="checkbox" id={`sidebar-menu-${i}`}
                                               className="sidebar-menu-checkbox hidden"
                                               defaultChecked={Boolean(menu.children.find(menu => menu.menuActive === menuActive))}
                                        />
                                        <label
                                            htmlFor={`sidebar-menu-${i}`}
                                            className={cn(
                                                'w-full cursor-pointer grid select-none gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                menu.children.find(menu => menu.menuActive === menuActive) && 'bg-default-100 text-default-800 font-bold',
                                                'grid-cols-[1fr_auto]'
                                            )}
                                        >
                                            <div className="grid grid-cols-[30px_1fr] gap-2.5 items-center">
                                                <div
                                                    className="w-full aspect-[1/1] flex items-center justify-center">
                                                    {menu.children.find(menu => menu.menuActive === menuActive) ? (
                                                        <>{menu.iconOnActive}</>
                                                    ) : (
                                                        <>{menu.iconOnInactive}</>
                                                    )}
                                                </div>

                                                {menu.label}
                                            </div>
                                            <div>
                                                <TbChevronRight
                                                    className="size-5 sidebar-icon transition duration-200 ease-in-out"/>
                                            </div>
                                        </label>

                                        <div className="sidebar-sub-menu">
                                            <div className={cn('overflow-hidden ms-6 border-l border-default-200')}>
                                                { menu.children.map((menu) => (
                                                    <NavLink
                                                        key={menu.path}
                                                        to={menu.path}
                                                        className={cn(
                                                            'w-full grid grid-cols-[30px_1fr] gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                            menu.menuActive === menuActive && 'text-default-800 font-semibold'
                                                        )}
                                                    >
                                                        <div
                                                            className="w-full aspect-[1/1] flex items-center justify-center">
                                                            {menu.menuActive === menuActive ? (
                                                                <>{menu.iconOnActive}</>
                                                            ) : (
                                                                <>{menu.iconOnInactive}</>
                                                            )}
                                                        </div>

                                                        {menu.label}
                                                    </NavLink>
                                                )) }
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={menu.path}>
                                        <NavLink
                                            to={menu.path}
                                            className={cn(
                                                'w-full grid grid-cols-[30px_1fr] gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                menu.menuActive === menuActive && 'bg-default-100 text-default-800 font-bold'
                                            )}
                                        >
                                            <div
                                                className="w-full aspect-[1/1] flex items-center justify-center">
                                                {menu.menuActive === menuActive ? (
                                                    <>{menu.iconOnActive}</>
                                                ) : (
                                                    <>{menu.iconOnInactive}</>
                                                )}
                                            </div>

                                            {menu.label}
                                        </NavLink>
                                    </div>
                                ) }
                            </div>
                        )) }

                    </div>

                    <div>
                    {/*  menu bottom  */}
                        { menus.filter(menu => menu.isBottomMenu).map((menu, i) => (
                            <Fragment key={i}>
                                { menu.children ? (
                                    <div key={menu.path}>
                                        <input type="checkbox" id={`sidebar-menu-${i}`}
                                               className="sidebar-menu-checkbox hidden"
                                               defaultChecked={Boolean(menu.children.find(menu => menu.menuActive === menuActive))}
                                        />
                                        <label
                                            htmlFor={`sidebar-menu-${i}`}
                                            className={cn(
                                                'w-full cursor-pointer grid select-none gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                menu.children.find(menu => menu.menuActive === menuActive) && 'bg-default-100 text-default-800 font-bold',
                                                'grid-cols-[1fr_auto]'
                                            )}
                                        >
                                            <div className="grid grid-cols-[30px_1fr] gap-2.5 items-center">
                                                <div
                                                    className="w-full aspect-[1/1] flex items-center justify-center">
                                                    {menu.children.find(menu => menu.menuActive === menuActive) ? (
                                                        <>{menu.iconOnActive}</>
                                                    ) : (
                                                        <>{menu.iconOnInactive}</>
                                                    )}
                                                </div>

                                                {menu.label}
                                            </div>
                                            <div>
                                                <TbChevronRight
                                                    className="size-5 sidebar-icon transition duration-200 ease-in-out"/>
                                            </div>
                                        </label>

                                        <div className="sidebar-sub-menu">
                                            <div className={cn('overflow-hidden ms-6 border-l border-default-200')}>
                                                { menu.children.map((menu) => (
                                                    <NavLink
                                                        key={menu.path}
                                                        to={menu.path}
                                                        className={cn(
                                                            'w-full grid grid-cols-[30px_1fr] gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                            menu.menuActive === menuActive && 'text-default-800 font-semibold'
                                                        )}
                                                    >
                                                        <div
                                                            className="w-full aspect-[1/1] flex items-center justify-center">
                                                            {menu.menuActive === menuActive ? (
                                                                <>{menu.iconOnActive}</>
                                                            ) : (
                                                                <>{menu.iconOnInactive}</>
                                                            )}
                                                        </div>

                                                        {menu.label}
                                                    </NavLink>
                                                )) }
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={menu.path}>
                                        <NavLink
                                            to={menu.path}
                                            className={cn(
                                                'w-full grid grid-cols-[30px_1fr] gap-2.5 items-center hover:bg-default-100 rounded-lg px-3 py-2 text-default-500 relative group tracking-[0.2px]',
                                                menu.menuActive === menuActive && 'bg-default-100 text-default-800 font-bold'
                                            )}
                                        >
                                            <div
                                                className="w-full aspect-[1/1] flex items-center justify-center">
                                                {menu.menuActive === menuActive ? (
                                                    <>{menu.iconOnActive}</>
                                                ) : (
                                                    <>{menu.iconOnInactive}</>
                                                )}
                                            </div>

                                            {menu.label}
                                        </NavLink>
                                    </div>
                                ) }
                            </Fragment>
                        )) }
                    </div>
                </aside>
                {/* E: Sidebar */}

                {/* S: Main */}
                <div className="w-full h-[calc(100vh_-_65px)] overflow-y-auto custom-scroll without-space"
                     ref={mainRef}>
                    <div className="min-h-[calc(100vh_-_130px)]">
                        {children}
                    </div>

                    <footer className={'py-4 px-10 border-t border-default-200 text-center font-light mt-2.5 text-sm'}>
                        Copyright &copy; 2025, Tujuhub.
                    </footer>
                </div>
                {/* E: Main */}

            </div>


            {/* S: Modals */}
            {createBusinessModal.Element}
            {/* E: Modals */}
        </div>
    )
}