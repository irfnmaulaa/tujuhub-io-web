import {extendVariants, Form as FormHeroUI} from "@heroui/react";

const Form = extendVariants(FormHeroUI, { 
    defaultVariants: {
        className: "gap-8",
    }
})

export default Form