import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const API1_URL = `${API_URL}/api/clients`;

export const getClients = () => axios.get(API1_URL);
export const createClient = (data) => axios.post(API1_URL, data);
export const updateClient = (id, data) => axios.put(`${API1_URL}/${id}`, data);
export const deleteClient = (id) => axios.delete(`${API1_URL}/${id}`);
