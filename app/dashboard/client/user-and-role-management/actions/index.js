"use server";

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

const getAllRoles = async () => {
  const response = await fetchWithAuth("role");
  return response.json();
};

const getAllUsers = async (queryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(`user?${queryString}`);
  return response.json();
};

export const createUser = async (data) => {
  const response = await fetchWithAuth("user", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateUser = async (id, data) => {
  const response = await fetchWithAuth(`user/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};
export const getUserById = async (id) => {
  const response = await fetchWithAuth(`user/${id}`);
  return response.json();
};
export const deleteUser = async (id) => {
  const response = await fetchWithAuth(`user/${id}`, {
    method: "DELETE",
  });
  return response.json();
};
export const addRole = async (data) => {
  const response = await fetchWithAuth("role/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};
export { getAllRoles, getAllUsers };
