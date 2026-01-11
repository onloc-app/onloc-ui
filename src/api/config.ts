export const SERVER_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_WS_PORT || "6144"}`
export const API_URL = `${SERVER_URL}/api`
