import {StrictMode, Suspense} from "react";
import {BrowserRouter} from "react-router-dom";
import { QueryClientProvider, QueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import {cn, HeroUIProvider} from "@heroui/react";
import SuspenseFallback from "./shared/pages/fallbacks/SuspenseFallback.tsx";
import Fallback from "./shared/pages/fallbacks/Fallback.tsx";
import {queryClient} from "./shared/services/react-query.ts";
import AppRouter from "./routes/AppRouter.tsx";
import {Toaster} from "react-hot-toast";
import useTheme from "@/shared/hooks/useTheme.ts";

function App() {
    const {theme} = useTheme()
    return (
        <StrictMode>
            <div className={cn(theme, 'text-foreground bg-background')}>
                <BrowserRouter>
                    <QueryErrorResetBoundary>
                        {({ reset }) => (
                            <ErrorBoundary onReset={reset} FallbackComponent={Fallback}>
                                <Suspense fallback={<SuspenseFallback/>}>
                                    <HeroUIProvider>
                                        <QueryClientProvider client={queryClient}>
                                            <AppRouter/>
                                        </QueryClientProvider>
                                    </HeroUIProvider>
                                </Suspense>
                            </ErrorBoundary>
                        )}
                    </QueryErrorResetBoundary>
                </BrowserRouter>
            </div>
            <Toaster/>
        </StrictMode>
    )
}

export default App
