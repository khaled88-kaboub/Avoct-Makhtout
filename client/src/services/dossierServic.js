import axios from "axios";

const API_URL = "http://localhost:5000/api/dossiers";

export const getDossiers = () => axios.get(API_URL);

export const getDossierById = (id) =>
  axios.get(`${API_URL}/${id}`);

export const createDossier = (data) =>
  axios.post(API_URL, data);

export const updateDossier = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const closeDossier = (id) =>
  axios.put(`${API_URL}/${id}/close`);


