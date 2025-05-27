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
      const response = await api.get("/users", { withCredentials: true }); // Using GET /users

      // Extract user data based on the confirmed structure:
      // response.data = { message: "success", payload: [{ user_object }] }
      if (response.data && response.data.payload && Array.isArray(response.data.payload) && response.data.payload.length > 0) {
        const userDataFromPayload = response.data.payload[0]; // Get the first object from the payload array

        if (userDataFromPayload && Object.keys(userDataFromPayload).length > 0 && userDataFromPayload.name) {
          // Now userDataFromPayload is the user object { user_id, name, email, ... }
          setUser(userDataFromPayload);
          localStorage.setItem("user", JSON.stringify(userDataFromPayload)); // Cache after successful fetch
          return userDataFromPayload;
        } else {
          // Payload[0] was empty, not a proper object, or missing 'name'
          setUser(null);
          localStorage.removeItem("user");
          return null;
        }
      } else {
        // Payload was missing, not an array, or empty
        setUser(null);
        localStorage.removeItem("user");
        return null;
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken"); // Clear any old client-side token
      return null;
    }
  };

  useEffect(() => {
    // Call fetchCurrentUser on initial load/refresh to maintain session
    const initializeAuth = async () => {
      await fetchCurrentUser(); 
      setLoading(false);    
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
      // After successful registration, user is redirected to the login page
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