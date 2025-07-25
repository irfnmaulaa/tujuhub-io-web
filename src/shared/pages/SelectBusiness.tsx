import {Avatar, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton} from "@heroui/react";
import {TbLogout, TbPlus, TbUserCircle} from "react-icons/tb";
import {NavLink, useNavigate} from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import useProfile from "@/modules/profile/api/useProfile.ts";
import useBusinesses from "@/modules/business/api/useBusinesses.ts";
import Card from "@/shared/design-system/card/Card.tsx";
import useCreateBusinessModal from "@/modules/business/hooks/useCreateBusinessModal.tsx";

export default function SelectBusiness() {

    // define hooks
    const navigate = useNavigate()

    // define modals
    const createBusinessModal = useCreateBusinessModal()

    // define queries
    const profile = useProfile()
    const businesses = useBusinesses()

    if(!profile.data) {
        return (<div></div>)
    }

    return (
        <div className={'h-screen'}>
            <div className={'container mx-auto max-w-[600px] p-5 lg:py-24 flex flex-col items-center gap-7'}>
                <div className={'w-full flex justify-between'}>
                    <div className={'flex items-center justify-center'}>
                        <NavLink to={'/?preview=1'}> <img src={'/img/logo.png'} alt={'Tujuhub'} className="h-[35px] lg:h-[40px] logo"/> </NavLink>
                    </div>
                    <div className={'flex items-center justify-end'}>
                        <Dropdown placement="bottom-end" showArrow>
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    src={profile.data.picture || ''}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">{ profile.data.email }</p>
                                </DropdownItem>
                                <DropdownItem startContent={<TbUserCircle className={'size-5'}/>} key="profile">My Profile</DropdownItem>
                                <DropdownItem startContent={<TbLogout className={'size-5'}/>} key="logout" className={'text-red-500'}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex flex-col gap-2.5 w-full">
                    <p className={'text-default-500 w-full font-semibold mt-5'}>Select your business</p>

                    {(!businesses.isLoading && businesses.data) ? (
                        <>
                            {businesses.data.items.map(business => (
                                <Card key={business.id} isPressable onPress={() => {
                                    navigate(`/${business.id}`)
                                }} className={'w-full hover:bg-default-100'}>
                                    <CardBody className={'px-4 py-3.5 lg:text-lg flex-row items-center gap-3'}>
                                        { business.logoSrc ? (
                                            <Avatar
                                                className="bg-transparent transition-transform rounded-full lg:w-[55px] lg:h-[55px]"
                                                src={business.logoSrc}
                                            />
                                        ) : (
                                            <Avatar
                                                className="bg-transparent transition-transform rounded-full lg:w-[55px] lg:h-[55px]"
                                                src={`https://eu.ui-avatars.com/api/?name=${business.name}&size=250`}
                                            />
                                        ) }
                                        <div className={'line-clamp-1'}>
                                            {business.name}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <>
                            <Skeleton className={'w-full h-[85px] rounded-xl'}/>
                            <Skeleton className={'w-full h-[85px] rounded-xl'}/>
                            <Skeleton className={'w-full h-[85px] rounded-xl'}/>
                        </>
                    )}

                    <Button fullWidth size={'lg'} variant={'light'} className={'mt-3'} startContent={<TbPlus className={'size-5'}/>} onPress={() => {
                        createBusinessModal.onOpen()
                    }}>
                        Create new business
                    </Button>
                </div>
            </div>

            {createBusinessModal.Element}
        </div>
    )
}