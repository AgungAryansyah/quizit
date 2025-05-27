// contexts/AuthContext.jsx
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
      // *** IMPORTANT: Adjust based on your actual /users response structure ***
      const userData = response.data.user || response.data; 

      if (userData && Object.keys(userData).length > 0) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      return userData;
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      return null;
    }
  };

  useEffect(() => {
    // THIS IS THE KEY CHANGE: We now call fetchCurrentUser on initial load/refresh
    const initializeAuth = async () => {
      await fetchCurrentUser(); // Attempt to fetch user based on cookie
      setLoading(false);    // Set loading to false after the attempt
    };
    initializeAuth();
  }, []); // Empty dependency array: runs once on mount

  const login = async (email, password) => {
    setLoading(true);
    try {
      await api.post("/auths/login", { email, password }, {
        withCredentials: true,
      });
      const loggedInUser = await fetchCurrentUser(); 
      if (!loggedInUser) {
        throw new Error("Login succeeded but failed to fetch user details from /users.");
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
      return { success: true }; // User will be redirected to login page
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
      // Log or handle backend logout error, but proceed with client-side cleanup
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