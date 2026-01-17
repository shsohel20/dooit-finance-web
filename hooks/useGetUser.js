const { getLoggedInUser } = require("@/app/actions")
const { useLoggedInUserStore } = require("@/app/store/useLoggedInUser")
import { useEffect } from "react"

const useGetUser = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore()
  const getUser = async () => {
    const response = await getLoggedInUser()
    if (response.success) {
      setLoggedInUser(response.data)
    }
  }
  useEffect(() => {
    getUser()
  }, [])
  return { loggedInUser }
}
export default useGetUser