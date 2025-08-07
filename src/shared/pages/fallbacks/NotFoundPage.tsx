import { useNavigate } from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import { TbHome, TbError404 } from "react-icons/tb";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 max-w-md mx-auto px-6">
                <div className="flex justify-center">
                    <TbError404 className="size-24 text-default-400" />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">404</h1>
                    <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
                    <p className="text-default-500">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <Button 
                    size="lg" 
                    startContent={<TbHome className="size-5" />}
                    onPress={handleBackToHome}
                    className="mt-6"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
}