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

export const updateModule = async (data, moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}`, {
    method: "PUT",
    body: JSON.stringify(data),
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

export const updatePart = async (data, partId) => {
  const response = await fetchWithAuth(`training-modules/parts/${partId}`, {
    method: "PUT",
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
export const getAssignmentsforAdmin = async () => {
  const response = await fetchWithAuth("training-assignments", {
    method: "GET",
  });
  return response.json();
};

export const getAssignmentsForManager = async () => {
  const response = await fetchWithAuth("training-assignments/by-me", {
    method: "GET",
  });
  return response.json();
};

export const getMyAssignments = async () => {
  const response = await fetchWithAuth("training-assignments/mine", {
    method: "GET",
  });
  return response.json();
};

export const getMyProgressForModule = async (moduleId) => {
  const response = await fetchWithAuth(`training-progress/${moduleId}`, {
    method: "GET",
  });
  return response.json();
};

export const startWatchingVideo = async (moduleId) => {
  const response = await fetchWithAuth(`training-progress/${moduleId}/start`, {
    method: "POST",
    // body: JSON.stringify(data),
  });
  return response.json();
};

export const updateVideoProgress = async (moduleId, data) => {
  const response = await fetchWithAuth(`training-progress/${moduleId}/watch`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const submitQuiz = async (moduleId, data) => {
  const response = await fetchWithAuth(`training-progress/${moduleId}/attempts`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const publishModule = async (moduleId, data) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteModule = async (moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const deletePart = async (partId) => {
  const response = await fetchWithAuth(`training-modules/parts/${partId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const updateQuestion = async (data, questionId) => {
  const response = await fetchWithAuth(`training-modules/questions/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const completeModule = async (moduleId) => {
  const response = await fetchWithAuth(`training-progress/${moduleId}/complete`, {
    method: "POST",
  });
  return response.json();
};

export const grantRetake = async (moduleId, data) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/retake`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getModuleLearners = async (moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/learners`, {
    method: "GET",
  });
  return response.json();
};

export const getReportsOverview = async () => {
  const response = await fetchWithAuth("training-reports/overview", {
    method: "GET",
  });
  return response.json();
};

export const getReportsLearners = async () => {
  const response = await fetchWithAuth("training-reports/learners", {
    method: "GET",
  });
  return response.json();
};

export const getModuleAccess = async (moduleId) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/access`, {
    method: "GET",
  });
  return response.json();
};

export const assignModuleAccess = async (moduleId, data) => {
  const response = await fetchWithAuth(`training-modules/${moduleId}/access`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteModuleAccess = async (accessId) => {
  const response = await fetchWithAuth(`training-modules/access/${accessId}`, {
    method: "DELETE",
  });
  return response.json();
};
