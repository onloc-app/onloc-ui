import type { Tier } from "@/types/types"
import api from "../apiClient"

export async function getTiers(): Promise<Tier[]> {
  const { data } = await api.get("/tiers")
  return data.tiers
}

export async function getTier(id: bigint): Promise<Tier> {
  const { data } = await api.get(`/tiers/${id}`)
  return data.tier
}

export async function postTier(tier: Tier): Promise<Tier> {
  const { data } = await api.post("/tiers", {
    name: tier.name,
    max_devices: tier.max_devices,
  })
  return data.tier
}

export async function patchTier(tier: Tier): Promise<Tier> {
  const { data } = await api.patch("/tiers", {
    id: tier.id,
    name: tier.name,
    max_devices: tier.max_devices,
  })
  return data.tier
}

export async function deleteTier(id: bigint): Promise<void> {
  await api.delete(`/tiers/${id}`)
}

export async function reorderTiers(tiers: Tier[]): Promise<void> {
  await api.post("/tiers/reorder", { tiers })
}
