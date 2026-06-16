"use server";

import { fetchWithAuth } from "@/services/serverApi";

const createEmployee = async (employeeData) => {
  const response = await fetchWithAuth("staff", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
  return response.json();
};

export { createEmployee };
