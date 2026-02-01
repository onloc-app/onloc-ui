import { getConnections } from "@/api"
import { MainAppBar } from "@/components"
import { AddConnectionButton, ConnectionCard } from "@/components/connections"
import { NavOptions } from "@/types/enums"
import type { Connection } from "@/types/types"
import { Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function Connections() {
  const { t } = useTranslation()

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: () => getConnections(),
  })

  return (
    <>
      <MainAppBar selectedNav={NavOptions.CONNECTIONS} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: { xs: 1, sm: 0.8, md: 0.6 },
            height: 1,
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 500,
                  textAlign: { xs: "left", sm: "center", md: "left" },
                }}
              >
                {t("pages.connections.title")}
              </Typography>
              <AddConnectionButton />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {connections &&
              connections.map((connection) => {
                return (
                  <ConnectionCard key={connection.id} connection={connection} />
                )
              })}
          </Box>
        </Box>
      </Box>
    </>
  )
}
