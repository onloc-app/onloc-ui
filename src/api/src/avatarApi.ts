import type { Avatar } from "@/types/types"
import api from "../apiClient"

const ENDPOINT = "/avatars"

export async function upsertAvatar(file: File): Promise<Avatar> {
  const formData = new FormData()
  formData.append("avatar", file)

  const { data } = await api.post(ENDPOINT, formData)
  return data
}
