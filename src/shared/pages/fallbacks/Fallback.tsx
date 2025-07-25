import type {FallbackProps} from "react-error-boundary";

export default function Fallback({ error }: FallbackProps) {

    if (error.status === 401) {
        return <div>Unauthenticated</div>
    } else if (error.status === 403) {
        return <div>Forbidden</div>
    } else if (error.status === 404) {
        return <div>Not found</div>
    }

    return <div>Not found</div>
}