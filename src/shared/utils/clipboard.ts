import { toastSuccess } from "./toast";

export const copyText = async ({ text, copiedMessage }: {
    text: string;
    copiedMessage?: string;
}) => {
    await navigator.clipboard.writeText(text)
    toastSuccess(copiedMessage || 'Copied to clipboard')
}