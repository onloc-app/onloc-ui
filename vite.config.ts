import { defineConfig, loadEnv, type UserConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "")

  let allowedHosts: true | string[] | undefined

  if (env.VITE_ALLOWED_HOSTS === "all") {
    allowedHosts = true
  } else if (env.VITE_ALLOWED_HOSTS) {
    allowedHosts = env.VITE_ALLOWED_HOSTS.split(",")
      .map((host) => host.trim())
      .filter(Boolean)
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      open: false,
      allowedHosts: allowedHosts,
    },
  }
})
