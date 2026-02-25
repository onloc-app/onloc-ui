import { createTheme } from "@mantine/core"

export const baseTheme = createTheme({
  fontFamily: "Outfit",
  headings: {
    fontFamily: "Nunito",
  },
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
    success: [
      "#e6f4ea",
      "#cce9d5",
      "#99d3ab",
      "#66bd81",
      "#3fa65f",
      "#2e7d32",
      "#256628",
      "#1b4f1f",
      "#123815",
      "#0a210c",
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
    info: [
      "#dffbff",
      "#caf2ff",
      "#99e2ff",
      "#64d2ff",
      "#3cc4fe",
      "#23bcfe",
      "#00b5ff",
      "#00a1e4",
      "#008fcd",
      "#007cb6",
    ],
    warning: [
      "#fff8e0",
      "#ffeecb",
      "#ffdd9a",
      "#fdca65",
      "#fcb52b",
      "#fcaf1b",
      "#fcaa07",
      "#e19500",
      "#c88400",
      "#ae7100",
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
