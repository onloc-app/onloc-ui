import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { getAccessToken, getRefreshToken } from "./helpers/localStorage"

const PrivateRoutes = () => {
  const auth = useAuth()
  if (!auth || !getRefreshToken() || !getAccessToken())
    return <Navigate to="/login" />
  return <Outlet />
}

export default PrivateRoutes
