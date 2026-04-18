import type { Tier } from "@/types/types"
import api from "../apiClient"

const ENDPOINT = "/tiers"

export async function getTiers(): Promise<Tier[]> {
  const { data } = await api.get(ENDPOINT)
  return data.tiers
}

export async function getTier(id: bigint): Promise<Tier> {
  const { data } = await api.get(`${ENDPOINT}/${id}`)
  return data.tier
}

export async function postTier(tier: Tier): Promise<Tier> {
  const { data } = await api.post(ENDPOINT, {
    name: tier.name,
    max_devices: tier.max_devices,
  })
  return data.tier
}

export async function patchTier(tier: Tier): Promise<Tier> {
  const { data } = await api.patch(ENDPOINT, {
    id: tier.id,
    name: tier.name,
    max_devices: tier.max_devices,
  })
  return data.tier
}

export async function deleteTier(id: bigint): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`)
}

export async function reorderTiers(tiers: Tier[]): Promise<void> {
  await api.post(`${ENDPOINT}/reorder`, { tiers })
}
