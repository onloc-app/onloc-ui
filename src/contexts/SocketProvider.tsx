import { getAccessToken } from "@/api/apiClient"
import { SERVER_URL } from "@/api/config"
import SocketContext from "@/contexts/SocketContext"
import { useAuth } from "@/hooks/useAuth"
import type { Device, Location } from "@/types/types"
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

    const handleLocationsChange = ({
      locations,
    }: {
      locations: Location[]
    }) => {
      locations.forEach((newLocation) => {
        const parseLocation = parseLocationForBigInts(newLocation)
        queryClient.setQueriesData<Location[]>(
          { queryKey: ["locations"], exact: false },
          (prev) => {
            if (!prev) return prev
            const existingIds = new Set(prev.map((l) => l.id.toString()))
            if (existingIds.has(parseLocation.id.toString())) return prev
            return [...prev, parseLocation]
          },
        )
        queryClient.setQueryData<Device[]>(["devices"], (devices) => {
          if (!devices) return devices
          return devices.map((d) =>
            String(d.id) === String(parseLocation.device_id)
              ? { ...d, latest_location: parseLocation }
              : d,
          )
        })
        queryClient.setQueryData<Device[]>(["shared_devices"], (devices) => {
          if (!devices) return devices
          return devices.map((d) =>
            String(d.id) === String(parseLocation.device_id)
              ? { ...d, latest_location: parseLocation }
              : d,
          )
        })
      })
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

function parseLocationForBigInts(location: Location): Location {
  return {
    ...location,
    id: BigInt(location.id),
    device_id: BigInt(location.device_id),
  }
}
