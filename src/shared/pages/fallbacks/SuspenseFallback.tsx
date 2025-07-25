import {Spinner} from "@heroui/react";

export default function SuspenseFallback() {
    return (
        <div className="w-full min-h-[100vh] flex items-center justify-center text-center">
            <Spinner
                variant={'simple'}
                color="primary"
                label="Loading..."
            />
        </div>
    )
}