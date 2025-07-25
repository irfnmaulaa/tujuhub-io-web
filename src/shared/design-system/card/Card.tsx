import {extendVariants, Card as HeroUICard} from "@heroui/react";

const Card = extendVariants(HeroUICard, {
    defaultVariants: {
        shadow: 'none',
        disableRipple: "true",
    },
})

export default Card