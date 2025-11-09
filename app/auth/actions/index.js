'use server'

import { serverApi } from "@/services/serverApi"
import { cookies } from "next/headers"
// import { cookies } from "next/headers"

// const { default: api } = require("@/services")


export const login = async (credentials) => {

    const res = await serverApi('auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
    console.log(credentials)
    console.log("login response", res)

    if (res.status === 200) {
        cookies().set("token", res.data.token)
        return res.data
    } else {
        return { success: false, message: "Login failed" }
    }

}