import axios from "axios";

export const Axios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export const AxiosGuest = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})