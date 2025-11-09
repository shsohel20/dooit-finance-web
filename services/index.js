'use server'
import axios from "axios"
// import { token } from "./token"
const token = null





const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6830/api/v1/",
    withCredentials: true, // if using cookies/sessions
    headers: {
        "Content-Type": "application/json",
    },
})

// Optional: Add interceptors
api.interceptors.request.use(
    (config) => {
        // Example: attach token if stored
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Example: handle global errors
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login...")
        }
        return Promise.reject(error)
    }
)

export default api
