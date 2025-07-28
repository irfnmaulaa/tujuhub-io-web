import {StrictMode, Suspense, useEffect, useRef} from "react";
import { QueryClientProvider, QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import {cn, HeroUIProvider, ToastProvider} from "@heroui/react";
import SuspenseFallback from "./shared/pages/fallbacks/SuspenseFallback.tsx";
import Fallback from "./shared/pages/fallbacks/Fallback.tsx";
import {queryClient} from "./shared/services/react-query.ts";
import AppRouter from "./routes/AppRouter.tsx";
import useTheme from "@/shared/hooks/useTheme.ts";

function App() {
    const {theme} = useTheme()
    const htmlRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if(!htmlRef.current) {
            htmlRef.current = document.querySelector('html')
        }
    }, [htmlRef.current])

    useEffect(() => {
        if(theme && htmlRef.current) {
            htmlRef.current.classList.remove('dark', 'light')
            htmlRef.current.classList.add(theme)
        }
    }, [theme, htmlRef.current]);

    return (
        <StrictMode>
            <div className={cn('text-foreground bg-background')}>
                <QueryErrorResetBoundary>
                    {({ reset }) => (
                        <ErrorBoundary onReset={reset} FallbackComponent={Fallback}>
                            <Suspense fallback={<SuspenseFallback/>}>
                                <HeroUIProvider>
                                    <ToastProvider placement={'top-center'}/>
                                    <QueryClientProvider client={queryClient}>
                                        <AppRouter/>
                                    </QueryClientProvider>
                                </HeroUIProvider>
                            </Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </div>
        </StrictMode>
    )
}

export default App
