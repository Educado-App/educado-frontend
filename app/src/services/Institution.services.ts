import axios from "axios";
import { BACKEND_URL } from "../helpers/environment";

export interface Institution {
  _id?: string;
  institutionName: string;
  domain: string;
  secondaryDomain: string;
}

const getInstitutions = async (token: string) => {
  return await axios.get<Institution[]>(`${BACKEND_URL}/api/institutions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getSingleInstitution = async (id: string, token: string) => {
  return await axios.get(`${BACKEND_URL}/api/institutions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createInstitution = async (token: string, data: Institution) => {
  return await axios.post(
    `${BACKEND_URL}/api/institutions/`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const updateInstitution = async (
  id: string,
  token: string,
  data: Institution
) => {
  return await axios.patch(
    `${BACKEND_URL}/api/institutions/${id}`,
    { ...data },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const deleteInstitution = async (id: string, token: string) => {
  return await axios.delete(`${BACKEND_URL}/api/institutions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const institutionService = {
  getInstitutions,
  getSingleInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
};
