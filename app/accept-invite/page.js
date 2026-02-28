import React from "react";
import TokenValidation from "@/components/TokenValidation";
export default async function AcceptInvite({ searchParams }) {
  //query params
  const { token, cid } = await searchParams;

  return (
    <div>
      <TokenValidation token={token} cid={cid} />
    </div>
  );
}
