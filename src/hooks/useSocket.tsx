import SocketContext from "@/contexts/socket"
import { useContext } from "react"

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error("useSocket must be used within SocketProvider")
  return context
}
