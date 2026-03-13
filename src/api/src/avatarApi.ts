import type { Avatar } from "@/types/types"
import api from "../apiClient"

export async function upsertAvatar(file: File): Promise<Avatar> {
  const formData = new FormData()
  formData.append("avatar", file)

  const { data } = await api.post("/avatars", formData)
  return data
}
