import type { UserTier } from "@/types/types"
import api from "../apiClient"

const ENDPOINT = "/usertiers"

export async function postUserTier(userTier: UserTier): Promise<UserTier> {
  const { data } = await api.post(ENDPOINT, {
    user_id: userTier.user_id.toString(),
    tier_id: userTier.tier_id.toString(),
  })
  return data.user_tier
}
