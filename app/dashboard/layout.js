"use client";
import useGetUser from "@/hooks/useGetUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function DashboardLayout({ children }) {
  // const { loggedInUser } = useGetUser();
  // console.log('loggedInUser', loggedInUser);
  // const router = useRouter();
  // const isUser=loggedInUser?.userType==='user';
  // useEffect(() => {
  //   if (isUser) {
  //     router.push('/dashboard/customer');
  //   }
  // }, [isUser]);
  return (
    <div className="relative">
      {children}
      {/* <ChatBot /> */}
    </div>
  );
}
