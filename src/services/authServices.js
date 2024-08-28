import axios from "axios";
import { AUTH_BASE_ROUTE } from "../Constants";

const API_URL = AUTH_BASE_ROUTE;

export const register = async (username, email, password) => {
  const response = await axios.post(
    `${API_URL}/register`,
    {
      username,
      email,
      password,
    },
    { withCredentials: true }
  );
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


