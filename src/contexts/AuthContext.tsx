import type { LoginResponse, RegisterResponse } from "@/api"
import type { Severity } from "@/types/enums"
import type { LoginCredentials, RegisterCredentials, User } from "@/types/types"
import { createContext, type RefObject } from "react"
import type { Socket } from "socket.io-client"

interface AuthContextType {
  user: User | null
  socketRef: RefObject<Socket | null>
  throwMessage: (message: string, severity: Severity) => void
  Severity: typeof Severity
  loginAction: (credentials: LoginCredentials) => Promise<LoginResponse>
  registerAction: (
    credentials: RegisterCredentials,
  ) => Promise<RegisterResponse>
  logoutAction: () => void
  changeUsernameAction: (username: string) => Promise<unknown>
  changePasswordAction: (password: string) => Promise<unknown>
}

const AuthContext = createContext<AuthContextType | null>(null)

export default AuthContext
