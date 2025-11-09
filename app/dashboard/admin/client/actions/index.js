'use server';

import api from "@/services";
import { fetchWithAuth } from "@/services/serverApi";


export const createClient = async (clientData) => {
  const response = await fetchWithAuth('client/new', {
    method: 'POST',
    body: JSON.stringify(clientData)
  })
  // const response = await api.post('client/new', clientData);
  return response.json();
}

export const getAllClients = async (page, limit) => {
  const response = await fetchWithAuth(`client?page=${page}&limit=${limit}`, {
    method: 'GET',
  })
  return response.json();
}

export const getClientById = async (id) => {
  const response = await fetchWithAuth(`client/${id}`, {
    method: 'GET',
  })
  return response.json();
}

export const deleteClient = async (id) => {
  const response = await fetchWithAuth(`client/${id}`, {
    method: 'DELETE',
  })
  return response.json();
}
export const updateClient = async (id, clientData) => {
  const response = await fetchWithAuth(`client/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData)
  })
  return response.json();
}