import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "@/shared/pages/Home.tsx";
import LoginPage from "@/modules/auth/pages/LoginPage.tsx";
import MentorArea from "@/shared/pages/areas/MentorArea.tsx";
import GuestArea from "@/shared/pages/areas/GuestArea.tsx";
import BusinessArea from "@/shared/pages/areas/BusinessArea.tsx";
import SelectBusiness from "@/shared/pages/SelectBusiness.tsx";
import CourseList from "@/modules/product/pages/CourseList.tsx";


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
                    }
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
        ]
    },
])

export default function AppRouter() {
    return (
        <RouterProvider router={routes}/>
    )
}