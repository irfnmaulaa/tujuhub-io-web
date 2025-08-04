import {extendVariants, NumberInput} from "@heroui/react";

const NumberField = extendVariants(NumberInput, {
    defaultVariants: {
        radius: 'sm',
    }
})

export default NumberField