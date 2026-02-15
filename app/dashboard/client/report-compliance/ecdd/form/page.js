import { ECDDForm } from "@/components/ecdd-form";
import React from "react";

const EcddFormPage = async ({ searchParams }) => {
  const params = await searchParams;
  return <ECDDForm {...params} />;
};

export default EcddFormPage;
