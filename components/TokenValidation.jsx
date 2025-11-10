"use client";
import { inviteTokenValidation } from "@/app/accept-invite/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TokenValidation({ token, cid }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const validateToken = async () => {
    setLoading(true);
    const response = await inviteTokenValidation(token, cid);
    console.log("response", response);
    if (response.success) {
      const userId = response.data.userId;
      if (userId) {
        localStorage.setItem("invite_token", token);
        localStorage.setItem("invite_cid", cid);
        router.push(`/auth/login?token=${token}&cid=${cid}`);
      } else {
        router.push(`/auth/register?token=${token}&cid=${cid}`);
      }
      setLoading(false);
    } else {
      setError(response.error);
      setLoading(false);
    }
  };
  useEffect(() => {
    validateToken();
  }, []);
  return (
    <div className="h-[80vh] grid place-items-center w-full">
      {loading ? <Loader2 className="animate-spin size-10" /> : null}
      {error ? <p className="text-lg">{error}</p> : null}
    </div>
  );
}
