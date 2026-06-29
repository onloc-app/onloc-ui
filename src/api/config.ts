const port = import.meta.env.VITE_BACKEND_PORT ?? window.location.port
const apiServerUrl = import.meta.env.VITE_ONLOC_API_SERVER_URL

export const SERVER_URL = `${window.location.protocol}//${window.location.hostname}${port ? `:${port}` : ""}`

export const API_URL = apiServerUrl ?? `${SERVER_URL}/api`
