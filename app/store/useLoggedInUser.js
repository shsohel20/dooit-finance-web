import { useEffect } from "react";
import { create } from "zustand";
import { getLoggedInUser } from "../actions";

//turn this into a react hook

export const useLoggedInUserStore = create((set) => ({
    loggedInUser: null,
    fetching: false,
    fetchLoggedInUser: async () => {
        set({ fetching: true })
        const response = await getLoggedInUser()
        set({ loggedInUser: response.data, fetching: false })
    },
    setLoggedInUser: (loggedInUser) => set({ loggedInUser }),

}))

export const useLoggedInUser = () => {
    const { loggedInUser, setLoggedInUser, fetchLoggedInUser, fetching } = useLoggedInUserStore()
    useEffect(() => {
        console.log('fetching', fetching)
        fetchLoggedInUser()
    }, [])
    return { loggedInUser, setLoggedInUser, fetching }
}