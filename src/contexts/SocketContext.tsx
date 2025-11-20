import { createContext, type RefObject } from "react"
import type { Socket } from "socket.io-client"

interface SocketContextType {
  socketRef: RefObject<Socket | null>
}

const SocketContext = createContext<SocketContextType | null>(null)

export default SocketContext
