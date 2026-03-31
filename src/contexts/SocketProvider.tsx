import { getAccessToken } from "@/api/apiClient"
import { SERVER_URL } from "@/api/config"
import SocketContext from "@/contexts/SocketContext"
import { useAuth } from "@/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, type ReactElement } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketProviderProps {
  children: ReactElement
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const auth = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!auth.user) return

    const socket = io(SERVER_URL, {
      auth: { token: getAccessToken() },
      path: "/ws",
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    const handleLocationsChange = () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      queryClient.invalidateQueries({ queryKey: ["devices"] })
      queryClient.invalidateQueries({ queryKey: ["shared_devices"] })
    }

    const handleDeviceShareChange = () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    }

    const handleAdminLocationsChange = () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
    }

    socket.on("locations-change", handleLocationsChange)
    socket.on("connections-change", handleDeviceShareChange)
    socket.on("admin-locations-change", handleAdminLocationsChange)

    return () => {
      socket.off("locations-change", handleLocationsChange)
      socket.off("connections-change", handleDeviceShareChange)
      socket.off("admin-locations-change", handleAdminLocationsChange)
      socket.disconnect()
    }
  }, [auth.user, queryClient])

  return (
    <SocketContext.Provider value={{ socketRef }}>
      {children}
    </SocketContext.Provider>
  )
}
