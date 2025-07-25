import {Navigate, Outlet} from "react-router-dom";
import useProfile from "@/modules/profile/api/useProfile.ts";
import SuspenseFallback from "@/shared/pages/fallbacks/SuspenseFallback.tsx";

export default function MentorArea() {
    const profile = useProfile()

    if(profile.isLoading) {
        return <SuspenseFallback/>
    }

    if(profile.isError) {
        return <Navigate to={'/sign-in'}/>
    }

    return (
        <>
            <Outlet/>
        </>
    )
}