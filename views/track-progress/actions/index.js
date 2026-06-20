"use server";

import { fetchWithAuth } from "@/services/serverApi";

const createEmployee = async (employeeData) => {
  const response = await fetchWithAuth("staff", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
  return response.json();
};

const getStuffsByRole = async (roleid) => {
  const response = await fetchWithAuth(`staff/role/${roleid}`);
  return response.json();
};

const getOcrData = async (payload) => {
  const response = await fetchWithAuth(`ocr/document`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json();
};

export { createEmployee, getStuffsByRole, getOcrData };
