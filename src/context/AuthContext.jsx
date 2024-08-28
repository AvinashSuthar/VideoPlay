import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AUTH_BASE_ROUTE } from "../Constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    user: null,
  });

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${AUTH_BASE_ROUTE}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuth({ ...auth, user: response.data });
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuth((prevAuth) => ({ ...prevAuth, token, isAuthenticated: true }));
        await fetchUserData(token);
      } else {
        logout();
      }
    };

    verifyToken();
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setAuth({ token, isAuthenticated: true, user: null });
    await fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ fetchUserData, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
