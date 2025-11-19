import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getAccessToken, getRefreshToken } from "@/api/apiClient"

const PrivateRoutes = () => {
  const user = useAuth()
  if (!user || !getRefreshToken() || !getAccessToken())
    return <Navigate to="/login" />
  return <Outlet />
}

export default PrivateRoutes
