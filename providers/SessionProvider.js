'use client'
import { SessionProvider } from "next-auth/react"
import { useLoggedInUserStore } from "@/app/store/useLoggedInUser"
import { getLoggedInUser } from "@/app/actions"
import { useEffect } from "react"
const AuthProvider = ({ children }) => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore()
  // console.log("loggedInUser", JSON.stringify(loggedInUser, null, 2))

  const getUser = async () => {
    const response = await getLoggedInUser()
    //  console.log("loggedInUser response", response)
    if (response.success) {
      setLoggedInUser(response.data)
    }
  }
  useEffect(() => {
    getUser()
  }, [])
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthProvider