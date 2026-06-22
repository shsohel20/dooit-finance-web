"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const getAllEntityTypes = async () => {
  const response = await fetchWithAuth("entity-type");
  const data = await response.json();
  const options = data?.data?.map((item) => ({
    label: item.name,
    value: item._id,
    ...item,
  }));
  return {
    ...data,
    data: options,
  };
  //   return data;
};
