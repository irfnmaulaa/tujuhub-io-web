import type {FallbackProps} from "react-error-boundary";
import NotFoundPage from "./NotFoundPage.tsx";
import ErrorPage from "./ErrorPage.tsx";

export default function Fallback({ error, resetErrorBoundary }: FallbackProps) {

    if (error.status === 401) {
        return <div>Unauthenticated</div>
    } else if (error.status === 403) {
        return <div>Forbidden</div>
    } else if (error.status === 404) {
        return <NotFoundPage />
    }

    return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
}