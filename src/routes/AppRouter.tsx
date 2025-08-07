import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/shared/pages/Home.tsx";
import LoginPage from "@/modules/auth/pages/LoginPage.tsx";
import MentorArea from "@/shared/pages/areas/MentorArea.tsx";
import GuestArea from "@/shared/pages/areas/GuestArea.tsx";
import BusinessArea from "@/shared/pages/areas/BusinessArea.tsx";
import SelectBusiness from "@/shared/pages/SelectBusiness.tsx";
import CourseList from "@/modules/product/pages/CourseList.tsx";
import EventList from "@/modules/product/pages/EventList.tsx";
import MembershipList from "@/modules/product/pages/MembershipList.tsx";
import PricingBundleList from "@/modules/pricing/pages/PricingBundleList.tsx";
import LandingPageList from "@/modules/landing-page/pages/LandingPageList.tsx";
import RegisterPage from "@/modules/auth/pages/RegisterPage.tsx";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/modules/auth/pages/ResetPasswordPage";
import NotFoundPage from "@/shared/pages/fallbacks/NotFoundPage.tsx";
import TransactionList from "@/modules/transaction/pages/TransactionList";


const routes = createBrowserRouter([
    {
        path: '/',
        element: <MentorArea/>,
        children: [
            {
                index: true,
                element: <SelectBusiness/>
            },
            {
                path: ':businessId',
                element: <BusinessArea/>,
                children: [
                    {
                        path: '',
                        element: <Home/>
                    },
                    {
                        path: 'courses',
                        element: <CourseList/>
                    },
                    {
                        path: 'events',
                        element: <EventList/>
                    },
                    {
                        path: 'memberships',
                        element: <MembershipList/>
                    }, 
                    {
                        path: 'pricing-bundles',
                        element: <PricingBundleList/>
                    },
                    {
                        path: 'landing-pages',
                        element: <LandingPageList/>
                    },
                    {
                        path: 'transactions',
                        element: <TransactionList/>
                    },
                ]
            },
        ]
    },
    {
        path: '/',
        element: <GuestArea/>,
        children: [
            {
                path: 'sign-in',
                element: <LoginPage/>
            },
            {
                path: 'sign-up',
                element: <RegisterPage/>
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage/>
            },
            {
                path: 'reset-password',
                element: <ResetPasswordPage/>
            },
        ]
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }
])

export default function AppRouter() {
    return (
        <RouterProvider router={routes}/>
    )
}