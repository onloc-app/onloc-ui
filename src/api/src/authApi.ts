import api, { getRefreshToken, setPrivateKey } from "@/api/apiClient"
import {
  decryptPrivateKey,
  deriveKey,
  encryptPrivateKey,
  exportPrivateKey,
  exportPublicKey,
  generateKeypair,
} from "@/helpers/crypto"
import type { User } from "@/types/types"

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface RegisterResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface StatusResponse {
  registration: boolean
  is_setup: boolean
}

export async function getStatus(): Promise<StatusResponse> {
  const { data } = await api.get("/status")
  return data
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", {
    username: username,
    password: password,
  })

  const encryptionKey = await deriveKey(password)
  const privateKey = await decryptPrivateKey(
    data.user.encrypted_private_key,
    encryptionKey,
  )

  const exportedPrivateKey = await exportPrivateKey(privateKey)
  data.user.private_key = exportedPrivateKey
  setPrivateKey(exportedPrivateKey)

  return data
}

export async function register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  const keypair = await generateKeypair()
  const publicKey = await exportPublicKey(keypair.publicKey)

  const derivedKey = await deriveKey(password)
  const encryptedPrivateKey = await encryptPrivateKey(
    keypair.privateKey,
    derivedKey,
  )

  const { data } = await api.post("/auth/register", {
    username: username,
    password: password,
    public_key: publicKey,
    encrypted_private_key: encryptedPrivateKey,
  })

  const exportedPrivateKey = await exportPrivateKey(keypair.privateKey)
  data.user.private_key = exportedPrivateKey
  setPrivateKey(exportedPrivateKey, true)

  return data
}

export async function logout(): Promise<void> {
  await api.delete("/tokens", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ refresh_token: getRefreshToken() }),
  })
  setPrivateKey(null)
}
