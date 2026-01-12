const port = import.meta.env.VITE_BACKEND_PORT ?? window.location.port

export const SERVER_URL = `${window.location.protocol}//${window.location.hostname}${port ? `:${port}` : ""}`

export const API_URL = `${SERVER_URL}/api`
