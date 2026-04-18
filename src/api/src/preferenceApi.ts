import type { Preference } from "@/types/types"
import api from "../apiClient"

const ENDPOINT = "/preferences"

export async function getPreferences(): Promise<Preference[]> {
  const { data } = await api.get(ENDPOINT)
  return data.preferences
}

export async function getPreferenceByKey(key: string): Promise<Preference> {
  const { data } = await api.get(`${ENDPOINT}?key=${key}`)
  return data.preferences[0]
}

export async function postPreference(
  preference: Preference,
): Promise<Preference> {
  const { data } = await api.post(ENDPOINT, {
    user_id: preference.user_id,
    key: preference.key,
    value: preference.value,
  })
  return data.preference
}

export async function patchPreference(
  preference: Preference,
): Promise<Preference> {
  const { data } = await api.patch(ENDPOINT, {
    id: preference.id,
    user_id: preference.user_id,
    key: preference.key,
    value: preference.value,
  })
  return data
}
