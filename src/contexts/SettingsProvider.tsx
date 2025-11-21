import { getPreferences } from "@/api/src/preferenceApi"
import { MapProjection, PreferencesKey } from "@/types/enums"
import type { Preference } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { useMemo, type ReactElement } from "react"
import SettingsContext from "./SettingsContext"

interface SettingsProviderProps {
  children: ReactElement
}

export default function SettingsProvider({ children }: SettingsProviderProps) {
  const { data: preferences } = useQuery<Preference[]>({
    queryKey: ["user_preferences"],
    queryFn: () => getPreferences(),
  })

  const defaultProjection = useMemo<MapProjection>(() => {
    const preference = preferences?.find(
      (preference) => preference.key === PreferencesKey.DEFAULT_PROJECTION,
    )
    if (!preference) return MapProjection.MERCATOR
    return preference.value as MapProjection
  }, [preferences])

  const mapAnimations = useMemo<boolean>(() => {
    const preference = preferences?.find(
      (preference) => preference.key === PreferencesKey.MAP_ANIMATIONS,
    )
    if (!preference?.value) return true
    return preference.value === "true"
  }, [preferences])

  return (
    <SettingsContext.Provider
      value={{
        defaultProjection,
        mapAnimations,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
