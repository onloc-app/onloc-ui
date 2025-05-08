import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./contexts/AuthProvider"

const PrivateRoutes = () => {
  const user = useAuth()
  if (!user || !user.token) return <Navigate to="/login" />
  return <Outlet />
}

export default PrivateRoutes
