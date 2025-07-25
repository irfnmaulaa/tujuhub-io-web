import {extendVariants, Button as HeroUIButton} from "@heroui/react";

const Button = extendVariants(HeroUIButton, {
    defaultVariants: {
        radius: 'sm',
        color: 'primary',
    },
    variants: {
        color: {
            white: 'shadow-xs bg text-foreground border border-default-300',
            default: 'text-default-600',
        }
    },
})

export default Button