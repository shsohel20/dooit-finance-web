"use server";
import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getAllPolicyDocuments = async (queryParams) => {
  try {
    const response = await fetchWithAuth(`policy-hub`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching policy documents:", error);
    return [];
  }
};

export const generatePolicy = async (data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/generate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error generating policy:", error);
    return [];
  }
};

export const getPolicyById = async (id) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${id}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching policy by id:", error);
    return [];
  }
};
export const updatePolicy = async (id, data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error updating policy:", error);
    return [];
  }
};

export const downloadPolicy = async (id) => {
  try {
    const endpoint = `policy-hub/${id}/download`;
    const response = await fetchWithAuth(endpoint);
    if (!response.ok) throw new Error("Failed to download policy");
    return response.json();
  } catch (error) {
    console.error("Error downloading policy:", error);
    return [];
  }
};

export const createPolicyHub = async (data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/new`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating policy hub:", error);
    return { success: false };
  }
};

export const deletePolicyHub = async (id) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${id}`, { method: "DELETE" });
    return response.json();
  } catch (error) {
    console.error("Error deleting policy hub:", error);
    return { success: false };
  }
};

export const importPolicyHubFromDocx = async (formData) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub/import-docx`,
      { method: "POST", body: formData },
      false,
      false,
      true,
    );
    return response.json();
  } catch (error) {
    console.error("Error importing policy hub from DOCX:", error);
    return { success: false };
  }
};

export const getAllPolicyDocumentsPaginated = async (page = 1, limit = 20) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub?page=${page}&limit=${limit}`,
      { method: "GET" },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching policy documents:", error);
    return { success: false, data: [] };
  }
};

// ── Version Control ───────────────────────────────────────────────────────────

export const listPolicyVersions = async (id, page = 1, limit = 20) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub/${id}/versions?page=${page}&limit=${limit}`,
      { method: "GET" },
    );
    return response.json();
  } catch (error) {
    console.error("Error listing policy versions:", error);
    return { success: false, data: [] };
  }
};

export const getPolicyVersion = async (id, versionNumber) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub/${id}/versions/${versionNumber}`,
      { method: "GET" },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching policy version:", error);
    return { success: false };
  }
};

export const restorePolicyVersion = async (id, versionNumber) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub/${id}/restore/${versionNumber}`,
      { method: "POST" },
    );
    return response.json();
  } catch (error) {
    console.error("Error restoring policy version:", error);
    return { success: false };
  }
};

export const diffPolicyVersions = async (id, v1, v2) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub/${id}/diff?v1=${v1}&v2=${v2}`,
      { method: "GET" },
    );
    return response.json();
  } catch (error) {
    console.error("Error diffing policy versions:", error);
    return { success: false };
  }
};

// ── AFC Documents ─────────────────────────────────────────────────────────────

export const getAllAfcDocuments = async (page = 1, limit = 20) => {
  try {
    const response = await fetchWithAuth(`afc-documents?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching AFC documents:", error);
    return { success: false, data: [] };
  }
};

export const getAfcDocumentById = async (id) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}`, { method: "GET" });
    return response.json();
  } catch (error) {
    console.error("Error fetching AFC document:", error);
    return { success: false };
  }
};

export const createAfcDocument = async (data) => {
  try {
    const response = await fetchWithAuth(`afc-documents/new`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating AFC document:", error);
    return { success: false };
  }
};

export const updateAfcDocument = async (id, data) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating AFC document:", error);
    return { success: false };
  }
};

export const deleteAfcDocument = async (id) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}`, { method: "DELETE" });
    return response.json();
  } catch (error) {
    console.error("Error deleting AFC document:", error);
    return { success: false };
  }
};

export const importAfcDocumentFromDocx = async (formData) => {
  try {
    const response = await fetchWithAuth(
      `afc-documents/import-docx`,
      { method: "POST", body: formData },
      false,
      false,
      true,
    );
    return response.json();
  } catch (error) {
    console.error("Error importing AFC document from DOCX:", error);
    return { success: false };
  }
};

export const exportAfcDocumentAsPdf = async (id) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}/download`, { method: "GET" });
    return response.json();
  } catch (error) {
    console.error("Error exporting AFC document as PDF:", error);
    return { success: false };
  }
};

export const exportAfcDocumentAsDocx = async (id) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}/export-docx`, { method: "GET" });
    return response.json();
  } catch (error) {
    console.error("Error exporting AFC document as DOCX:", error);
    return { success: false };
  }
};

export const pushAfcDocumentToPolicyHub = async (id, data) => {
  try {
    const response = await fetchWithAuth(`afc-documents/${id}/to-policy-hub`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error pushing AFC document to Policy Hub:", error);
    return { success: false };
  }
};

// ── Policy Hub Templates ──────────────────────────────────────────────────────

export const getAllTemplates = async (page = 1, limit = 20) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub-templates?page=${page}&limit=${limit}`,
      { method: "GET" },
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { success: false, data: [] };
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await fetchWithAuth(`policy-hub-templates/${id}`, { method: "GET" });
    return response.json();
  } catch (error) {
    console.error("Error fetching template:", error);
    return { success: false };
  }
};

export const createTemplate = async (data) => {
  try {
    const response = await fetchWithAuth(`policy-hub-templates/new`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating template:", error);
    return { success: false };
  }
};

export const updateTemplate = async (id, data) => {
  try {
    const response = await fetchWithAuth(`policy-hub-templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating template:", error);
    return { success: false };
  }
};

export const deleteTemplate = async (id) => {
  try {
    const response = await fetchWithAuth(`policy-hub-templates/${id}`, { method: "DELETE" });
    return response.json();
  } catch (error) {
    console.error("Error deleting template:", error);
    return { success: false };
  }
};

export const importTemplateFromDocx = async (formData) => {
  try {
    const response = await fetchWithAuth(
      `policy-hub-templates/import-docx`,
      { method: "POST", body: formData },
      false,
      false,
      true,
    );
    return response.json();
  } catch (error) {
    console.error("Error importing template from DOCX:", error);
    return { success: false };
  }
};

export const useTemplate = async (id, metadata = {}) => {
  try {
    const response = await fetchWithAuth(`policy-hub-templates/${id}/use`, {
      method: "POST",
      body: JSON.stringify({ metadata }),
    });
    return response.json();
  } catch (error) {
    console.error("Error using template:", error);
    return { success: false };
  }
};

export const savePolicyAsTemplate = async (policyHubId, data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${policyHubId}/save-as-template`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error saving policy as template:", error);
    return { success: false };
  }
};
