import { getAccessToken } from "@/api/apiClient"
import { SERVER_URL } from "@/api/config"
import SocketContext from "@/contexts/SocketContext"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, type ReactElement } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketProviderProps {
  children: ReactElement
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      auth: { token: getAccessToken() },
      path: "/ws",
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!socketRef.current) return

    const handleLocationsChange = () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      })
      queryClient.invalidateQueries({
        queryKey: ["devices"],
      })
      queryClient.invalidateQueries({
        queryKey: ["shared_devices"],
      })
    }

    socketRef.current.on("locations-change", handleLocationsChange)

    const handleDeviceShareChange = () => {
      queryClient.invalidateQueries({
        queryKey: ["devices"],
      })
    }

    socketRef.current.on("connections-change", handleDeviceShareChange)

    const handleAdminLocationsChange = () => {
      queryClient.invalidateQueries({
        queryKey: ["admin_users"],
      })
    }

    socketRef.current.on("admin-locations-change", handleAdminLocationsChange)
    return () => {
      socketRef.current?.off("locations-create", handleLocationsChange)
      socketRef.current?.off("connections-change", handleDeviceShareChange)
    }
  }, [queryClient])

  return (
    <SocketContext.Provider value={{ socketRef }}>
      {children}
    </SocketContext.Provider>
  )
}
