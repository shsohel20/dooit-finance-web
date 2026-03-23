"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const createModule = async (data) => {
  const response = await fetchWithAuth("training-modules", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getModules = async () => {
  const response = await fetchWithAuth("training-modules", {
    method: "GET",
  });
  return response.json();
};

export const getModuleById = async (id) => {
  const response = await fetchWithAuth(`training-modules/${id}`, {
    method: "GET",
  });
  return response.json();
};

export const createPart = async (data, moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/parts`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};
export const getAllParts = async (moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/parts`, {
    method: "GET",
  });
  return response.json();
};

export const getPartById = async (partId) => {
  const response = await fetchWithAuth(`training-modules/parts/${partId}`, {
    method: "GET",
  });
  return response.json();
};

export const createQuestion = async (data, partId) => {
  const response = await fetchWithAuth(`training-modules/parts/${partId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteQuestion = async (questionId) => {
  const response = await fetchWithAuth(`training-modules/questions/${questionId}`, {
    method: "DELETE",
  });
  return response.json();
};
export const assignAssignment = async (data, moduleId) => {
  const response = await fetchWithAuth(`training-assignments/${moduleId}/assign`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  console.log("response", response);
  return response.json();
};
