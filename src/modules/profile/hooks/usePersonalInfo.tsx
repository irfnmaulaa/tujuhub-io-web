import {Avatar, cn} from "@heroui/react";

export default function usePersonalInfo() {
    return {
        getAvatar: ({ user, size = 'md', isBordered = true, className = '' }: {
            user: {
                firstName: string;
                email: string;
                picture: string | null | undefined
            } | null | undefined;
            size?: 'sm' | 'md' | 'lg';
            isBordered?: boolean;
            className?: string;
        }) => {
            const length_of_name = user ? ((user.email.length + user.firstName.length) % 9) + 1 : 1

            return (
                <Avatar
                    size={size}
                    isBordered={isBordered}
                    as="button"
                    className={cn('transition-transform', className)}
                    src={user?.picture || `https://sircle-prod-assets.s3.ap-southeast-3.amazonaws.com/avatars/boy-${length_of_name}.webp`}
                />
            )
        }
    }
}