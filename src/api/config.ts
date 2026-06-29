const port = import.meta.env.VITE_BACKEND_PORT ?? window.location.port
export const API_SERVER_URL = import.meta.env.VITE_ONLOC_API_SERVER_URL

export const SERVER_URL = `${window.location.protocol}//${window.location.hostname}${port ? `:${port}` : ""}`

export const API_URL = API_SERVER_URL ? `${API_SERVER_URL}/api`:  `${SERVER_URL}/api`
