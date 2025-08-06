import { Form } from "@heroui/react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout.tsx";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/modules/auth/schema/auth-schema.ts";
import { toastSuccess } from "@/shared/utils/toast.ts";
import { useResetPassword } from "../api/useResetPassword";
import { useEffect } from "react";
import { setFormError } from "@/shared/utils/error";

export default function ResetPasswordPage() {

    // define hooks
    const [query] = useSearchParams()
    const token = query.get('token')
    const navigate = useNavigate()

    // define state
    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema)
    })
    const { errors } = form.formState 

    // define mutations
    const resetPassword = useResetPassword({
        onSuccess: () => {
            toastSuccess('Password reset successfully!');
            navigate('/sign-in');
            form.reset();
            query.delete('token');
            query.delete('email');
            query.delete('redirect_url');
        },
        onError: (error) => { 
            setFormError({ form, error })
        }
    })

    // handle request reset password
    const handleresetPassword = async (data: ResetPasswordSchema) => {
        await resetPassword.mutateAsync(data)
    }

    useEffect(() => {
        if(!token) {
            navigate('/sign-in');
        } else {
            form.setValue('token', token);
        }
    }, [token])


    return (
        <AuthLayout>

            <Form onSubmit={form.handleSubmit(handleresetPassword)} className="flex flex-col gap-3 w-full">
                <TextField
                    type="password"
                    label="New password"
                    placeholder="Enter new password"
                    autoFocus
                    {...form.register('newPassword')}
                    isInvalid={!!errors.newPassword}
                    errorMessage={errors.newPassword?.message}
                    isDisabled={resetPassword.isLoading}
                />
                <TextField
                    type="password"
                    label="Confirm password"
                    placeholder="Enter password confirmation"
                    autoFocus
                    {...form.register('confirmNewPassword')}
                    isInvalid={!!errors.confirmNewPassword}
                    errorMessage={errors.confirmNewPassword?.message}
                    isDisabled={resetPassword.isLoading}
                /> 
                <div className="mt-4 w-full">
                    <Button color={'primary'} size="lg" fullWidth type="submit" isLoading={resetPassword.isLoading}>
                        Reset Password
                    </Button>
                </div> 
                <div className="text-sm text-gray-500 text-center my-6 w-full">
                    <NavLink to={`/sign-in${query.get('redirect_url') ? `?redirect_url=${query.get('redirect_url')}` : ''}`} className="text-primary">
                        Back to login page
                    </NavLink>
                </div>
            </Form>

        </AuthLayout>
    )
}