import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const AdminRoutes = () => {
  const auth = useAuth()
  if (!auth.user?.admin) return <Navigate to="/dashboard" />
  return <Outlet />
}

export default AdminRoutes
