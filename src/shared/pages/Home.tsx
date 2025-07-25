import useProfile from "@/modules/profile/api/useProfile.ts";
import SuspenseFallback from "@/shared/pages/fallbacks/SuspenseFallback.tsx";
import BusinessLayout from "@/shared/layouts/BusinessLayout.tsx";

export default function Home() {
    const profile = useProfile()

    if(profile.isLoading || !profile.data) {
        return <SuspenseFallback/>
    }

    return (
        <BusinessLayout
            pageTitle={'Dashboard'}
            menuActive={'dashboard'}
        >

        </BusinessLayout>
    )
}