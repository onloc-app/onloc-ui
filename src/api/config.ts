export const API_URL = `${window.location.protocol}//${
  window.location.hostname
}:${process.env.REACT_APP_API_PORT || "6145"}/api`
export const SERVER_URL = `${window.location.protocol}//${
  window.location.hostname
}:${process.env.REACT_APP_WS_PORT || "6145"}`
