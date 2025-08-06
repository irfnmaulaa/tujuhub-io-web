import type {JSX} from "react";
import {useParams} from "react-router-dom";
import {
    TbAd2, TbAutomaticGearbox,
    TbBox,
    TbBoxMultiple,
    TbBoxMultipleFilled, TbBrandParsinta,
    TbBuildingStore,
    TbCalendarEvent,
    TbChartBar,
    TbCreditCardPay,
    TbDeviceImac,
    TbDiscount,
    TbDiscountFilled, TbFiles, TbForms,
    TbLayoutGrid,
    TbLayoutGridFilled,
    TbPlayerPlayFilled, TbSettings, TbShieldCheck,
    TbShoppingCart,
    TbShoppingCartFilled, TbSpeakerphone,
    TbTag,
    TbTagFilled, TbUserCog,
    TbUsers, TbWallet
} from "react-icons/tb";

type Menu = {
    label: string;
    path: string;
    menuActive: MenuKeys;
    iconOnActive: JSX.Element;
    iconOnInactive: JSX.Element;
    isBottomMenu?: boolean;
    children?: Menu[]
    isNew?: boolean;
}

export type MenuKeys =
    'dashboard'
    | 'product'
    | 'course'
    | 'event'
    | 'membership'
    | 'manage-membership'
    | 'business'
    | 'members'
    | 'activity'
    | 'selling'
    | 'report'
    | 'pricing'
    | 'landing-page'
    | 'transaction'
    | 'customer'
    | 'broadcast'
    | 'ad'
    | 'settings'
    | 'discount'
    | 'learning-path'
    | 'article'
    | 'link'
    | 'general'
    | 'bank-account'
    | 'auth-2fa'
    | 'co-admin'
    | 'pricing-bundle'

const useMenus = () => {
    
    const {businessId} = useParams()
    
    const menus: Menu[] = [
        {
            label: 'Dashboard',
            path: `/${businessId}`,
            menuActive: 'dashboard',
            iconOnActive: <TbLayoutGridFilled className="size-6"/>,
            iconOnInactive: <TbLayoutGrid className="size-6"/>,
        },
        {
            label: 'Product',
            path: `/${businessId}/`,
            menuActive: 'product',
            iconOnActive: <TbBox className="size-6"/>,
            iconOnInactive: <TbBox className="size-6"/>,
            children: [
                {
                    label: 'E-Course',
                    path: `/${businessId}/courses`,
                    menuActive: 'course',
                    iconOnActive: <div className={'relative'}><TbBoxMultipleFilled className="size-6"/>
                        <TbPlayerPlayFilled className={'absolute left-[9px] top-[5px] size-2.5 text-default'}/></div>,
                    iconOnInactive: <div className={'relative'}><TbBoxMultiple className="size-6"/> <TbPlayerPlayFilled
                        className={'absolute left-[9px] top-[5px] size-2.5'}/></div>,
                },
                {
                    label: 'Webinar & Event',
                    path: `/${businessId}/events`,
                    menuActive: 'event',
                    iconOnActive: <TbCalendarEvent className="size-6"/>,
                    iconOnInactive: <TbCalendarEvent className="size-6"/>,
                },
                {
                    label: 'Membership',
                    path: `/${businessId}/memberships`,
                    menuActive: 'membership',
                    iconOnActive: <TbCreditCardPay className="size-6"/>,
                    iconOnInactive: <TbCreditCardPay className="size-6"/>,
                },
                {
                    label: 'Bundle',
                    path: `/${businessId}/pricing-bundles`,
                    menuActive: 'pricing-bundle',
                    iconOnActive: <TbFiles className="size-6"/>,
                    iconOnInactive: <TbFiles className="size-6"/>,
                },
            ]
        },
        {
            label: 'Selling',
            path: `/${businessId}/selling`,
            menuActive: 'selling',
            iconOnActive: <TbBuildingStore className="size-6"/>,
            iconOnInactive: <TbBuildingStore className="size-6"/>,
            children: [
                {
                    label: 'Landing Page',
                    path: `/${businessId}/landing-pages`,
                    menuActive: 'landing-page',
                    iconOnActive: <TbDeviceImac className="size-6"/>,
                    iconOnInactive: <TbDeviceImac className="size-6"/>,
                },
                {
                    label: 'Pricing',
                    path: `/${businessId}/pricings`,
                    menuActive: 'pricing',
                    iconOnActive: <TbTagFilled className="size-6"/>,
                    iconOnInactive: <TbTag className="size-6"/>,
                },
                {
                    label: 'Transaction',
                    path: `/${businessId}/transactions/completed`,
                    menuActive: 'transaction',
                    iconOnActive: <TbShoppingCartFilled className="size-6"/>,
                    iconOnInactive: <TbShoppingCart className="size-6"/>,
                },
                {
                    label: 'Customer',
                    path: `/${businessId}/customers`,
                    menuActive: 'customer',
                    iconOnActive: <TbUsers className="size-6"/>,
                    iconOnInactive: <TbUsers className="size-6"/>,

                },
                {
                    label: 'Discount',
                    path: `/${businessId}/discount`,
                    menuActive: 'discount',
                    iconOnActive: <TbDiscountFilled className="size-6"/>,
                    iconOnInactive: <TbDiscount className="size-6"/>,

                },
                {
                    label: 'Broadcast',
                    path: `/${businessId}/broadcast`,
                    menuActive: 'broadcast',
                    iconOnActive: <TbSpeakerphone className="size-6"/>,
                    iconOnInactive: <TbSpeakerphone className="size-6"/>,

                },
                {
                    label: 'Ad',
                    path: `/${businessId}/ads`,
                    menuActive: 'ad',
                    iconOnActive: <TbAd2 className="size-6"/>,
                    iconOnInactive: <TbAd2 className="size-6"/>,

                },
                {
                    label: 'Report',
                    path: `/${businessId}/reports`,
                    menuActive: 'report',
                    iconOnActive: <TbChartBar className="size-6"/>,
                    iconOnInactive: <TbChartBar className="size-6"/>,
                },
            ]
        },
        {
            label: 'Automation',
            path: `/${businessId}/settings`,
            menuActive: 'settings',
            iconOnActive: <TbAutomaticGearbox className="size-6"/>,
            iconOnInactive: <TbAutomaticGearbox className="size-6"/>,
            isNew: true,
        },
        {
            label: 'Setting',
            path: `/${businessId}/settings`,
            menuActive: 'settings',
            iconOnActive: <TbSettings className="size-6"/>,
            iconOnInactive: <TbSettings className="size-6"/>,

            isBottomMenu: true,
            children: [
                {
                    label: 'Edit Business Info',
                    path: `/${businessId}/settings/general`,
                    menuActive: 'general',
                    iconOnActive: <TbForms className="size-6"/>,
                    iconOnInactive: <TbForms className="size-6"/>,

                },
                {
                    label: 'Bank Account',
                    path: `/${businessId}/settings/bank-account`,
                    menuActive: 'bank-account',
                    iconOnActive: <TbWallet className="size-6"/>,
                    iconOnInactive: <TbWallet className="size-6"/>,

                },
                {
                    label: 'Co-Admins',
                    path: `/${businessId}/settings/admins`,
                    menuActive: 'co-admin',
                    iconOnActive: <TbUserCog className="size-6"/>,
                    iconOnInactive: <TbUserCog className="size-6"/>,

                },
                {
                    label: 'Auth 2FA',
                    path: `/${businessId}/settings/auth-2fa`,
                    menuActive: 'auth-2fa',
                    iconOnActive: <TbShieldCheck className="size-6"/>,
                    iconOnInactive: <TbShieldCheck className="size-6"/>,

                },
            ]
        },
        {
            label: 'Tutorial',
            path: `/${businessId}/settings`,
            menuActive: 'settings',
            iconOnActive: <TbBrandParsinta className="size-6"/>,
            iconOnInactive: <TbBrandParsinta className="size-6"/>,
            isBottomMenu: true,
        },
    ]

    return {
        menus
    }
}

export default useMenus