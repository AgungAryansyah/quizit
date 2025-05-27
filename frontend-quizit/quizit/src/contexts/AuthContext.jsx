"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../config/api" // Assuming this path is correct

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
  const [loading, setLoading] = useState(true) // This is the context's own loading state for auth operations

  useEffect(() => {
    // This effect tries to load user data from localStorage on initial app load.
    // This data is primarily set during registration or if a previous session
    // explicitly saved user details.
    const token = localStorage.getItem("authToken") // Typically set by register
    const userData = localStorage.getItem("user")   // Typically set by register

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem("authToken") // Clean up corrupted/invalid data
        localStorage.removeItem("user")
        setUser(null);
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // setLoading(true); // You might want to use the context's loading state here too
    try {
      // 1. Send login request. The backend is expected to set HTTP-only cookies.
      // The request itself doesn't return user data in the response body.
      await api.post("/auths/login", { email, password }, {
        withCredentials: true, // Crucial for sending/receiving cookies
      })

      // 2. Since backend returns no user data in the response body upon successful login,
      // set a minimal user state to indicate authentication.
      // The 'user' object here signifies an authenticated session, even without full details.
      // Full user details would typically be fetched by a separate call (e.g., to a /me endpoint)
      // or rely on data already in localStorage from a registration or previous session.
      setUser({ authenticated: true }) // Indicates an active session

      // setLoading(false);
      return { success: true }
    } catch (error) {
      // setLoading(false);
      // Refinement: Use error message from backend response if available,
      // similar to the register function.
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed. Please check your credentials.",
      }
    }
  }

  const register = async (name, email, password) => {
    // setLoading(true);
    try {
      const response = await api.post("/auths/register", { name, email, password })
      const { token, user: userData } = response.data // Register returns token and user data

      localStorage.setItem("authToken", token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData) // Set full user data after registration

      // setLoading(false);
      return { success: true }
    } catch (error) {
      // setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    // setLoading(true); // Optional: manage loading state
    // Note: You might also want to call a backend /logout endpoint
    // to invalidate the session/cookies on the server-side.
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    // setLoading(false);
    // navigate('/login'); // Or handle redirection as needed
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading, // AuthProvider's loading state for session initialization
    isAuthenticated: !!user, // True if user object is not null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}