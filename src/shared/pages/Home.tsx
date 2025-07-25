import useProfile from "@/modules/profile/api/useProfile.ts";
import SuspenseFallback from "@/shared/pages/fallbacks/SuspenseFallback.tsx";
import MentorLayout from "@/modules/mentor/layouts/MentorLayout.tsx";
import Button from "@/shared/design-system/button/Button.tsx";

export default function Home() {
    const profile = useProfile()

    if(profile.isLoading || !profile.data) {
        return <SuspenseFallback/>
    }

    return (
        <MentorLayout
            pageTitle={'Home'}
        >
            <Button color={'primary'}>Primary</Button>
            <Button color={'success'}>Primary</Button>
            <Button color={'danger'}>Primary</Button>
            <Button color={'warning'}>Primary</Button>
            <Button color={'white'}>White</Button>
        </MentorLayout>
    )
}