import type {AxiosError} from "axios";
import type {ApiError} from "@/shared/types/api-response.ts";
import type {FieldValues, Path, UseFormReturn} from "react-hook-form";

export function setFormError<D extends FieldValues>({error, form}: {
    error: AxiosError<ApiError, any>;
    form: UseFormReturn<D>
}) {
    if(error.response?.data.errors) {
        const {errors} = error.response.data
        Object.keys(errors).forEach(key => {
            form.setError(key as Path<D>, {
                message: errors[key]
            })
        })
    }
}