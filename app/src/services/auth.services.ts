import axios from "axios";
import {BACKEND_URL} from "../helpers/environment"

import { NewApplication } from "../interfaces/Application"
import { NewInstitution } from "../pages/NewInstitution"

export interface ContentCreatorApplication {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string | null;
}


const postUserLogin = async (credentials: any) => {
  return await axios.post(`${BACKEND_URL}/api/auth/login`, credentials);
};

const postUserSignup = async(formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/signup`, formData)
}

const postUserVerification = async(formData: ContentCreatorApplication) => {
  return await axios.post(`${BACKEND_URL}/api/auth/verify-email`, formData)
}

const GetCCApplications = async () => {
  return await axios.get(`${BACKEND_URL}/api/applications`);
};

const GetSingleCCApplication = async (id: string | undefined) => {
  return await axios.get(`${BACKEND_URL}/api/applications/${id}`)
};

const AcceptApplication = async (id: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}approve`);
};

const RejectApplication = async (id: string, rejectionReason: string): Promise<unknown> => {
  return await axios.put(`${BACKEND_URL}/api/applications/${id}reject`, { rejectionReason });
};

const postNewApplication = async (data: NewApplication) => {
  return await axios.post(`${BACKEND_URL}/api/applications/newapplication`, data);
};

const addInstitution = async (data: NewInstitution) => {
  return await axios.post(`${BACKEND_URL}/api/applications/newinstitution`, data);
}

const AuthServices = Object.freeze({
  postUserLogin,
  postUserSignup,
  GetCCApplications,
  GetSingleCCApplication,
  AcceptApplication,
  RejectApplication,
  postNewApplication,
  addInstitution,
  postUserVerification
});

export default AuthServices;