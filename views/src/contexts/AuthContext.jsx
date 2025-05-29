"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users", { withCredentials: true });
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const userDataFromPayload = response.data.payload[0];
        if (userDataFromPayload && typeof userDataFromPayload === 'object' && Object.keys(userDataFromPayload).length > 0 && userDataFromPayload.name) {
          setUser(userDataFromPayload);
          localStorage.setItem("user", JSON.stringify(userDataFromPayload));
          return userDataFromPayload;
        }
      }
      setUser(null);
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      return null;
    }
  };

  useEffect(() => {
    setUser(null);
    setLoading(false); 
  }, []); 

  const login = async (email, password) => {
    setLoading(true);
    try {
      await api.post("/auths/login", { email, password }, {
        withCredentials: true,
      });
      
      const loggedInUser = await fetchCurrentUser(); 
      
      if (!loggedInUser) {
        throw new Error("Login credentials were correct, but failed to retrieve user details afterwards.");
      }
      return { success: true }; 
    } catch (error) {
      setUser(null); 
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post("/auths/register", { name, email, password });
      return { success: true }; 
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auths/logout", {}, { withCredentials: true });
    } catch (error) {
      console.warn("AuthContext: Backend logout call failed or not implemented.", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};