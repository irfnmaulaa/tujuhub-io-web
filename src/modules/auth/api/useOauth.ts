import { currentHost } from "@/shared/utils/http";
import {useSearchParams} from "react-router-dom"; 

const useOauth = (params?: {
    redirect_url?: string;
}) => {
    const [query] = useSearchParams()
    return {
        loginWithGoogle: () => {
            const redirect_url = params?.redirect_url || query.get('redirect_url') || currentHost + '/'
            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google?redirect_url=${redirect_url}`
        }
    }
}

export default useOauth