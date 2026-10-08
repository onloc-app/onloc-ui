import type { MapProjection } from "@/types/enums"
import { createContext } from "react"

interface SettingsContextType {
  defaultProjection: MapProjection
  mapAnimations: boolean
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export default SettingsContext
