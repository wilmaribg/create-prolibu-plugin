import axios from "axios";
import { Auth } from "../utils/index.js";

export const useHttpClient = () => {
  const session = Auth.session();

  if (!session) {
    throw new Error("No session found. Please log in.");
  }

  const axiosInstance = axios.create({
    baseURL: session.baseUrl,
    headers: {
      Authorization: `Bearer ${session.apiKey}`,
    },
  });

  return axiosInstance;
};
