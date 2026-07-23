import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import { getAccessToken, getRefreshToken } from "./helpers/localStorage"

export default function UnauthenticatedRoutes() {
  const auth = useAuth()
  console.log(auth)
  console.log(getAccessToken())
  console.log(getRefreshToken())
  if (auth.user && getAccessToken() && getRefreshToken()) {
    return <Navigate to="/dashboard" />
  }
  return <Outlet />
}
