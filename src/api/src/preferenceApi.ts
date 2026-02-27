import type { Preference } from "@/types/types"
import api from "../apiClient"

export async function getPreferences(): Promise<Preference[]> {
  const { data } = await api.get("/preferences")
  return data.preferences
}

export async function getPreferenceByKey(key: string): Promise<Preference> {
  const { data } = await api.get(`/preferences?key=${key}`)
  return data.preferences[0]
}

export async function postPreference(
  preference: Preference,
): Promise<Preference> {
  const { data } = await api.post("/preferences", {
    user_id: preference.user_id,
    key: preference.key,
    value: preference.value,
  })
  return data.preference
}

export async function patchPreference(
  preference: Preference,
): Promise<Preference> {
  const { data } = await api.patch("/preferences", {
    id: preference.id,
    user_id: preference.user_id,
    key: preference.key,
    value: preference.value,
  })
  return data
}
