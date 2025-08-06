import { Form } from "@heroui/react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout.tsx";
import { useForm } from "react-hook-form";
import { NavLink, useSearchParams } from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestResetPasswordSchema, type RequestResetPasswordSchema } from "@/modules/auth/schema/auth-schema.ts";
import { toastSuccess } from "@/shared/utils/toast.ts";
import { useRequestResetPassword } from "../api/useRequestResetPassword";

export default function ForgotPasswordPage() {

    // define hooks
    const [query] = useSearchParams()

    // define state
    const form = useForm<RequestResetPasswordSchema>({
        resolver: zodResolver(requestResetPasswordSchema)
    })
    const { errors } = form.formState 

    // define mutations
    const requestResetPassword = useRequestResetPassword({
        onSuccess: () => {
            toastSuccess('Reset password email sent!') 
        },
    })

    // handle request reset password
    const handleRequestResetPassword = async (data: RequestResetPasswordSchema) => {
        await requestResetPassword.mutateAsync(data)
    } 


    return (
        <AuthLayout>

            <Form onSubmit={form.handleSubmit(handleRequestResetPassword)} className="flex flex-col gap-3 w-full">
                <TextField
                    type="email"
                    label="Email"
                    placeholder="Enter your email address"
                    autoFocus
                    {...form.register('email')}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    isDisabled={requestResetPassword.isLoading}
                />  
                <div className="mt-4 w-full">
                    <Button color={'primary'} size="lg" fullWidth type="submit" isLoading={requestResetPassword.isLoading}>
                        Send Reset Password Link
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