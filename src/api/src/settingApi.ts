import type { Setting } from "@/types/types"
import api from "@/api/apiClient"

const ENDPOINT = "/settings"

export async function getSettings(): Promise<Setting[]> {
  const { data } = await api.get(ENDPOINT)
  return data.settings
}

export async function postSetting(setting: Setting): Promise<Setting> {
  const { data } = await api.post(ENDPOINT, {
    key: setting.key,
    value: setting.value,
  })
  return data.setting
}

export async function patchSetting(setting: Setting): Promise<Setting> {
  const { data } = await api.patch(ENDPOINT, {
    id: setting.id,
    key: setting.key,
    value: setting.value,
  })
  return data.setting
}
