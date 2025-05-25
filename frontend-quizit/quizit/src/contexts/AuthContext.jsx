"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../config/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  // In AuthContext.jsx
  const login = async (email, password) => {
    try {
      // 1. Send login request (sets HTTP-only cookie)
      await api.post("/auths/login", { email, password }, { 
        withCredentials: true 
      });

      // 2. Since backend returns no data, assume login succeeded
      setUser({ authenticated: true }); // Minimal state

      return { success: true };
    } catch (error) {
      return { success: false, error: "Invalid credentials" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auths/register", { name, email, password })
      const { token, user: userData } = response.data

      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
