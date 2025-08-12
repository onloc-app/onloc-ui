import { createTheme } from "@mui/material"

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

export const lightTheme = createTheme({
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
  },
})

export const darkTheme = createTheme({
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
  },
})
