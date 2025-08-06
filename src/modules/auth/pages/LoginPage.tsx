import {Divider, Form} from "@heroui/react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout.tsx";
import {useForm} from "react-hook-form";
import {TbBrandGoogle} from "react-icons/tb";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {type LoginSchema, loginSchema} from "@/modules/auth/schema/auth-schema.ts";
import {useLogin} from "@/modules/auth/api/useLogin.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useProfile from "@/modules/profile/api/useProfile.ts";
import useOauth from "@/modules/auth/api/useOauth.ts";

export default function LoginPage() {

    // define hooks
    const [query] = useSearchParams()
    const navigate = useNavigate()

    // define state
    const loginForm = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    })
    const profile = useProfile()
    const oauth = useOauth()

    // define mutations
    const login = useLogin({
        onSuccess: () => {
            profile.remove()
            toastSuccess('Welcome back!')
            navigate('/')
        },
    })

    // handle login
    const handleLogin = async (data: LoginSchema) => {
        await login.mutateAsync(data)
    }

    // handle login with google
    const loginWithGoogle = () => {
        oauth.loginWithGoogle()
    }


    return (
        <AuthLayout>

            <Form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-3 w-full">
                <TextField
                    type="email"
                    label="Email"
                    placeholder="Enter your email address"
                    autoFocus
                    {...loginForm.register('email')}
                    isInvalid={!!loginForm.formState.errors.email}
                    errorMessage={loginForm.formState.errors.email?.message}
                    isDisabled={login.isLoading}
                />
                <TextField
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    {...loginForm.register('password')}
                    isInvalid={!!loginForm.formState.errors.password}
                    errorMessage={loginForm.formState.errors.password?.message}
                    isDisabled={login.isLoading}
                />
                <div className="flex items-center justify-between w-full">
                    <div></div>
                    <div>
                        <NavLink to={`/forgot-password${query.get('redirect_url') ? `?redirect_url=${query.get('redirect_url')}` : ''}`}>
                            Forgot password
                        </NavLink>
                    </div>
                </div>
                <div className="mt-4 w-full">
                    <Button color={'primary'} size="lg" fullWidth type="submit" isLoading={login.isLoading}>
                        Login
                    </Button>
                </div>
                <div className="grid my-3 grid-cols-[1fr_auto_1fr] w-full items-center gap-4">
                    <Divider/>
                    <div className="text-gray-500 text-xs">Or login with</div>
                    <Divider/>
                </div>
                <div className="w-full">
                    <Button size="lg" onPress={loginWithGoogle} color={'white'} fullWidth
                            startContent={<TbBrandGoogle className="size-5"/>} isDisabled={login.isLoading}>
                        Google
                    </Button>
                </div>
                <div className="text-sm text-gray-500 text-center my-6 w-full">
                    Don't have an account? <NavLink to={`/sign-up${query.get('redirect_url') ? `?redirect_url=${query.get('redirect_url')}` : ''}`} className="text-primary">Register</NavLink>
                </div>
            </Form>

        </AuthLayout>
    )
}