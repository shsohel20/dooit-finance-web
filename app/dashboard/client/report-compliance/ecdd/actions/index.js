'use server'

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";
import { revalidateTag } from "next/cache";

export async function createEcdd(formData) {
    const response = await fetchWithAuth('ecdd-report', {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    revalidateTag('ecdds');
    return response.json();
}



export async function getEcdds(queryParams) {
    try {
        const queryString = getQueryString(queryParams);
        const response = await fetchWithAuth(`ecdd-report?${queryString}`, {
            next: { tags: ['ecdds'] }
        });
        return response.json();
    } catch (error) {
        console.log('ecdd error', error)
    }
}

export async function getEcddById(id) {
    const response = await fetchWithAuth(`ecdd-report/${id}`);
    return response.json();
}

export async function updateEcdd(formData) {
    const { id, ...data } = formData;
    const response = await fetchWithAuth(`ecdd-report/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    revalidateTag('ecdds');
    return response.json();
}

export async function deleteEcdd(id) {
    const response = await fetchWithAuth(`ecdd-report/${id}`, {
        method: 'DELETE'
    })
    revalidateTag('ecdds');
    return response.json();
}

//auto populate form data
export const autoPopulatedEcddData = async (caseNumber) => {
    const data = { uid: caseNumber }
    const response = await fetch(`http://4.227.188.44:8000/ecdd_report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

export const getEcddByCaseNumber = async (caseNumber) => {
    const response = await fetchWithAuth(`ecdd-report/case/${caseNumber}`);
    return response.json();
}