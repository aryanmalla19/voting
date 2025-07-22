"use client"

import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated || user?.role !== "admin") {
    console.log("ANNSS");
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AdminRoute
