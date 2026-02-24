/* eslint-disable react-refresh/only-export-components */

import { baseTheme } from "@/contexts/themes"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { emotionTransform, MantineEmotionProvider } from "@mantine/emotion"
import { useMediaQuery } from "@mantine/hooks"
import { Notifications } from "@mantine/notifications"
import "@mantine/notifications/styles.css"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type ThemeMode = "light" | "dark" | "auto"

export const ColorModeContext = createContext<{
  mode: ThemeMode
  resolvedMode: "light" | "dark"
  setMode: (mode: ThemeMode) => void
}>({
  mode: "auto",
  resolvedMode: "light",
  setMode: () => {},
})

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem("theme") as ThemeMode) || "auto",
  )

  const resolvedMode = useMemo<"light" | "dark">(() => {
    if (mode === "auto") return prefersDarkMode ? "dark" : "light"
    return mode
  }, [mode, prefersDarkMode])

  useEffect(() => {
    localStorage.setItem("theme", mode)
  }, [mode])

  return (
    <ColorModeContext.Provider value={{ mode, resolvedMode, setMode }}>
      <MantineProvider
        theme={baseTheme}
        forceColorScheme={resolvedMode}
        stylesTransform={emotionTransform}
      >
        <MantineEmotionProvider>
          <Notifications />
          {children}
        </MantineEmotionProvider>
      </MantineProvider>
    </ColorModeContext.Provider>
  )
}

export default CustomThemeProvider

export const useColorMode = () => useContext(ColorModeContext)
