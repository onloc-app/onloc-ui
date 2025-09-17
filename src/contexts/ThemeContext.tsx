/* eslint-disable react-refresh/only-export-components */
// contexts/ThemeContext.tsx
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { darkTheme, lightTheme } from "@/contexts/themes"

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
    () => (localStorage.getItem("theme") as ThemeMode) || "auto"
  )

  const resolvedMode = useMemo<"light" | "dark">(() => {
    if (mode === "auto") return prefersDarkMode ? "dark" : "light"
    return mode
  }, [mode, prefersDarkMode])

  useEffect(() => {
    localStorage.setItem("theme", mode)
  }, [mode])

  useEffect(() => {
    // Sets an attribute for leaflet's CSS
    document.body.setAttribute("data-theme", resolvedMode)
  }, [resolvedMode])

  const theme = useMemo(() => {
    return resolvedMode === "light" ? lightTheme : darkTheme
  }, [resolvedMode])

  return (
    <ColorModeContext.Provider value={{ mode, resolvedMode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default CustomThemeProvider

export const useColorMode = () => useContext(ColorModeContext)
