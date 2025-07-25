import {extendVariants, Input} from "@heroui/react";

const TextField = extendVariants(Input, {
    defaultVariants: {
        radius: 'sm',
    }
})

export default TextField