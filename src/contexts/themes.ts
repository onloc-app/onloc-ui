import { createTheme } from "@mantine/core"
import { createTheme as muiCreateTheme } from "@mui/material"

export const baseTheme = createTheme({
  fontFamily: "Outfit",
  primaryColor: "brand",
  cursorType: "pointer",

  colors: {
    brand: [
      "#f2e9ff",
      "#dfcfff",
      "#bb9bff",
      "#9768ff",
      "#7436fe",
      "#6019fe",
      "#5609ff",
      "#4600e4",
      "#3d00cc",
      "#3200b4",
    ],
    error: [
      "#ffe3e3",
      "#ffc9c9",
      "#ffa8a8",
      "#ff8787",
      "#ff6b6b",
      "#fa5252",
      "#f03e3e",
      "#e03131",
      "#c92a2a",
      "#a51111",
    ],
  },

  primaryShade: {
    light: 3,
    dark: 3,
  },

  defaultRadius: "md",

  components: {
    Button: {
      defaultProps: {
        color: "brand.3",
      },
      styles: {
        root: { ":active": { transform: "none" } },
      },
    },
    ActionIcon: {
      defaultProps: {
        variant: "subtle",
        radius: "xl",
        size: "xl",
        color: "default",
      },
      styles: {
        root: { ":active": { transform: "none" } },
      },
    },
    Badge: {
      defaultProps: {
        tt: "none",
      },
    },
  },
})

declare module "@mui/material/styles" {
  interface Palette {
    contrast: Palette["primary"]
  }

  interface PaletteOptions {
    contrast?: PaletteOptions["primary"]
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    contrast: true
  }
}

export const lightTheme = muiCreateTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9768ff",
    },
    secondary: {
      main: "#c474ff",
    },
    contrast: {
      main: "#7d7d7d",
    },
  },
  typography: {
    fontFamily: ["Outfit", "Nunito"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontSize: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

export const darkTheme = muiCreateTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9768ff",
    },
    secondary: {
      main: "#de8bff",
    },
    contrast: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: ["Outfit", "Nunito"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontSize: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})
