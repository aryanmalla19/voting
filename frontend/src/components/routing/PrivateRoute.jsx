"use client"

import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import Spinner from "../layout/Spinner"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
