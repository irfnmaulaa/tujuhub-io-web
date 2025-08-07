import { useNavigate } from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import { TbHome, TbAlertTriangle } from "react-icons/tb";
import type { FallbackProps } from "react-error-boundary";

export default function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        resetErrorBoundary?.();
        navigate('/');
    };

    const handleTryAgain = () => {
        resetErrorBoundary?.();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md mx-auto px-6">
                <div className="flex justify-center">
                    <TbAlertTriangle className="size-24 text-danger" />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
                    <p className="text-default-500">
                        An unexpected error occurred. Please try again or return to the home page.
                    </p>
                    {error?.message && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm text-default-400 hover:text-default-600">
                                Error details
                            </summary>
                            <pre className="mt-2 text-xs text-danger bg-danger-50 p-3 rounded-lg overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                        variant="bordered"
                        size="lg" 
                        onPress={handleTryAgain}
                    >
                        Try Again
                    </Button>
                    <Button 
                        size="lg" 
                        startContent={<TbHome className="size-5" />}
                        onPress={handleBackToHome}
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}