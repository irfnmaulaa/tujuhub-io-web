import {useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {useRoutes} from 'react-router-dom'
import Home from "@/shared/pages/Home.tsx";
import ProductList from "@/modules/product/pages/ProductList.tsx";
import LoginPage from "@/modules/auth/pages/LoginPage.tsx";
import MentorArea from "@/shared/pages/areas/MentorArea.tsx";
import GuestArea from "@/shared/pages/areas/GuestArea.tsx";

const routes = [
    {
        path: '/',
        element: <MentorArea/>,
        children: [
            {
                path: '',
                element: <Home/>
            },
            {
                path: 'products',
                element: <ProductList/>
            }
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
]

export default function AppRouter() {
    const [query] = useSearchParams()

    useEffect(() => {
        if(query.get('sctoken')) {
            localStorage.setItem('__sctoken', query.get('sctoken') || '')
            const url = new URL(window.location.href)
            url.searchParams.delete('sctoken')
            window.location.href = url.toString()
        }
    }, [query]);

    return useRoutes(routes)
}