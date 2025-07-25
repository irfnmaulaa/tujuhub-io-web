import {Outlet} from "react-router-dom";
import {useDetailBusiness} from "@/modules/business/api/useDetailBusiness.ts";
import SuspenseFallback from "@/shared/pages/fallbacks/SuspenseFallback.tsx";

export default function BusinessArea() {
    const business = useDetailBusiness()

    if(business.isLoading) {
        return <SuspenseFallback/>
    }

    if(business.isError || !business.data) {
        return (<div>Not found</div>)
    }

    return (<Outlet/>)
}