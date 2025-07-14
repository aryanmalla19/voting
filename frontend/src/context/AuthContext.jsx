"use client"

// This file was already .js and should be mostly fine.
// Ensure no TypeScript specific syntax was accidentally introduced.
import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config" // Make sure this path is correct

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const setAuthTokenHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }

  const loadUser = async () => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setAuthTokenHeader(storedToken)
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`)
        setUser(res.data.data)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setAuthTokenHeader(null)
        // console.error("Load user error:", err.response?.data?.message || err.message);
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Removed token from dependency array to prevent re-triggering loadUser on setToken

  const register = async (formData) => {
    clearErrors()
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token) // This will trigger useEffect if token is in dep array
      setAuthTokenHeader(res.data.token)
      await loadUser() // Explicitly load user after setting token
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return { success: false, error: err.response?.data?.message || "Registration failed" }
    }
  }

  const login = async (formData) => {
    clearErrors()
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token) // This will trigger useEffect if token is in dep array
      setAuthTokenHeader(res.data.token)
      await loadUser() // Explicitly load user after setting token
      return { success: true }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return { success: false, error: err.response?.data?.message || "Login failed" }
    }
  }

  const logout = async () => {
    clearErrors()
    try {
      // Optional: Call backend logout endpoint if it invalidates tokens server-side
      // await axios.get(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.error("Logout error:", err)
    }
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setAuthTokenHeader(null)
  }

  const clearErrors = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
