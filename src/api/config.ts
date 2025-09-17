export const API_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_API_PORT || "6145"}/api`
export const SERVER_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_WS_PORT || "6145"}`
