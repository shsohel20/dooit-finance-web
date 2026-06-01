"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientInfo } from "./scan-qr/action";
import useGetUser from "@/hooks/useGetUser";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
function AcceptInviteLayout({ children }) {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const client = useSearchParams().get("client");
  const branch = useSearchParams().get("branch") || null;
  const { loggedInUser } = useGetUser();
  console.log("loggedInUser", loggedInUser);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await signOut();
    setLogoutLoading(false);
  };
  useEffect(() => {
    if (loggedInUser) {
      //logout the user
      handleLogout();
    }
  }, [loggedInUser]);
  useEffect(() => {
    const fetchClientData = async () => {
      const response = await getClientInfo(client);
      console.log("layoutresponse", response);
      const brandColor = response.data?.settings?.color;
      localStorage.setItem("brandColor", brandColor);
    };
    if (client) {
      fetchClientData();
    }
  }, [client]);
  //   if(loggedInUser) {
  if (logoutLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin size-10" />
        <p className="text-lg font-medium max-w-md text-center">Logging you out...</p>
      </div>
    );
  }
  return <div>{children}</div>;
}

export default AcceptInviteLayout;
