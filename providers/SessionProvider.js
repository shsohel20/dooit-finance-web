"use client";
import { SessionProvider } from "next-auth/react";
import { useLoggedInUserStore } from "@/app/store/useLoggedInUser";
import { getLoggedInUser } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const AuthProvider = ({ children }) => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore();
  // console.log("loggedInUser", JSON.stringify(loggedInUser, null, 2))

  const router = useRouter();

  // useEffect(() => {
  //   if (isUser) {
  //     router.push("/dashboard/customer");
  //   }
  // }, [isUser]);

  const getUser = async () => {
    const response = await getLoggedInUser();
    const inviteToken = localStorage.getItem("invite_token");
    //  console.log("loggedInUser response", response)
    if (response.success) {
      setLoggedInUser(response.data);
      const isUser = response.data?.userType === "user";
      if (isUser && !inviteToken) {
        router.push("/customer/dashboard");
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
