import {extendVariants, Textarea} from "@heroui/react";

const TextArea = extendVariants(Textarea, {
    defaultVariants: {
        radius: 'sm',
    }
})

export default TextArea