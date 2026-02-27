import type { UserTier } from "@/types/types"
import api from "../apiClient"

export async function postUserTier(userTier: UserTier): Promise<UserTier> {
  const { data } = await api.post("/usertiers", {
    user_id: userTier.user_id,
    tier_id: userTier.tier_id,
  })
  return data.user_tier
}
