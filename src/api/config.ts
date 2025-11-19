export const SERVER_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_WS_PORT || "6145"}`
export const API_URL = `${SERVER_URL}/api`
