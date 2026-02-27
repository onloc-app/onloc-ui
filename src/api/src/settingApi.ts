import type { Setting } from "@/types/types"
import api from "@/api/apiClient"

export async function getSettings(): Promise<Setting[]> {
  const { data } = await api.get("/settings")
  return data.settings
}

export async function postSetting(setting: Setting): Promise<Setting> {
  const { data } = await api.post("/settings", {
    key: setting.key,
    value: setting.value,
  })
  return data.setting
}

export async function patchSetting(setting: Setting): Promise<Setting> {
  const { data } = await api.patch("/settings", {
    id: setting.id,
    key: setting.key,
    value: setting.value,
  })
  return data.setting
}
