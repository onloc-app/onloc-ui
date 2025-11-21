import SettingsContext from "@/contexts/SettingsContext"
import { useContext } from "react"

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider")
  return context
}
