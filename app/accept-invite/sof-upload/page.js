import React from "react";
import SofUploadClient from "./SofUploadClient";

export default async function SofUploadPage({ searchParams }) {
  const { cid } = await searchParams;

  return <SofUploadClient cid={cid} />;
}
