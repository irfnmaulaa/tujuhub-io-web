import useProfile from "@/modules/profile/api/useProfile.ts";
import SuspenseFallback from "@/shared/pages/fallbacks/SuspenseFallback.tsx";
import MentorLayout from "@/modules/mentor/layouts/MentorLayout.tsx";

export default function Home() {
    const profile = useProfile()

    if(profile.isLoading || !profile.data) {
        return <SuspenseFallback/>
    }

    return (
        <MentorLayout
            pageTitle={'Dashboard'}
            menuActive={'dashboard'}
        >

        </MentorLayout>
    )
}