import {Avatar, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip} from "@heroui/react";
import Button from "@/shared/design-system/button/Button.tsx";
import {TbArrowLeft, TbLogout, TbUserCircle} from "react-icons/tb";
import {NavLink} from "react-router-dom";

export default function SelectBusiness() {
    return (
        <div className={'h-screen'}>
            <div className={'container mx-auto max-w-[600px] p-5 lg:py-24 flex flex-col items-center gap-7'}>
                <div className={'w-full grid-cols-[1fr,2fr,1fr] grid lg:grid-cols-3'}>
                    <div className={'flex items-center gap-4'}>
                        <Tooltip content={'Back home'}>
                            <Button
                                isIconOnly
                                color={'white'}
                                startContent={<TbArrowLeft className={'size-5'}/>}
                                onPress={() => {

                                }}
                            />
                        </Tooltip>
                    </div>
                    <div className={'flex items-center justify-center'}>
                        <NavLink to={'/?preview=1'}> <img src={'/img/logo.png'} alt={'Tujuhub'} className="h-[35px] lg:h-[40px]"/> </NavLink>
                    </div>
                    <div className={'flex items-center justify-end'}>
                        <Dropdown placement="bottom-end" showArrow>
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    src={`https://avatar.iran.liara.run/public/boy?username=user`}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">{  }</p>
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
                    <Card isPressable onPress={() => {

                    }} className={'w-full hover:bg-default-100'}>
                        <CardBody className={'p-4 lg:text-lg flex-row items-center gap-3'}>
                            <Avatar
                                className="bg-transparent transition-transform rounded lg:w-[55px] lg:h-[55px]"
                                src={`https://eu.ui-avatars.com/api/?name=irfn&size=250`}
                            />
                            <div className={'line-clamp-1'}>
                                Web Tech ID
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}