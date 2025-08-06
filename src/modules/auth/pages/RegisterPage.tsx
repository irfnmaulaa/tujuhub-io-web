import {Divider, Form} from "@heroui/react";
import AuthLayout from "@/modules/auth/layouts/AuthLayout.tsx";
import {useForm} from "react-hook-form";
import {TbBrandGoogle} from "react-icons/tb";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import Button from "@/shared/design-system/button/Button.tsx";
import TextField from "@/shared/design-system/form/TextField.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {type RegisterSchema, registerSchema} from "@/modules/auth/schema/auth-schema.ts";
import {useRegister} from "@/modules/auth/api/useRegister.ts";
import {toastSuccess} from "@/shared/utils/toast.ts";
import useProfile from "@/modules/profile/api/useProfile.ts";
import {setFormError} from "@/shared/utils/error.ts";
import useOauth from "@/modules/auth/api/useOauth.ts";

export default function RegisterPage() {

    // define hooks
    const [query] = useSearchParams()
    const navigate = useNavigate()

    // define data
    const profile = useProfile()
    const oauth = useOauth()

    // define state
    const registerForm = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema)
    })
    const { errors } = registerForm.formState

    // define mutations
    const register = useRegister({
        onSuccess: () => {
            profile.remove()
            toastSuccess('Welcome back!')
            navigate('/')
        },
        onError: (error) => {
            setFormError({ form: registerForm, error })
        }
    })

    // handle register
    const handleRegister = async (data: RegisterSchema) => {
        await register.mutateAsync(data)
    }

    // handle register with google
    const registerWithGoogle = () => {
        oauth.loginWithGoogle()
    }


    return (
        <AuthLayout>

            <Form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-3 w-full">
                <TextField
                    type="text"
                    label="Name"
                    placeholder="Enter your name"
                    autoFocus
                    {...registerForm.register('name')}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    isDisabled={register.isLoading}
                />
                <TextField
                    type="email"
                    label="Email"
                    placeholder="Enter email address"
                    {...registerForm.register('email')}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    isDisabled={register.isLoading}
                />
                <TextField
                    type="tel"
                    label="Phone"
                    placeholder="Enter phone number"
                    {...registerForm.register('phone')}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    isDisabled={register.isLoading}
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
                    <Button color={'primary'} size="lg" fullWidth type="submit" isLoading={register.isLoading}>
                        Register
                    </Button>
                </div>
                <div className="grid my-3 grid-cols-[1fr_auto_1fr] w-full items-center gap-4">
                    <Divider/>
                    <div className="text-gray-500 text-xs">Or register with</div>
                    <Divider/>
                </div>
                <div className="w-full">
                    <Button size="lg" onPress={registerWithGoogle} color={'white'} fullWidth
                            startContent={<TbBrandGoogle className="size-5"/>} isDisabled={register.isLoading}>
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