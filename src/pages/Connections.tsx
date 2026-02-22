import { getConnections } from "@/api"
import { AddConnectionButton, ConnectionCard, MainAppShell } from "@/components"
import { NavOptions } from "@/types/enums"
import type { Connection } from "@/types/types"
import { Box, Flex, Space, Typography } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function Connections() {
  const { t } = useTranslation()

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: () => getConnections(),
  })

  return (
    <MainAppShell selectedNav={NavOptions.CONNECTIONS}>
      <Flex direction="column" align="center" p="xs">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }} p="xs">
          <Flex justify="space-between">
            <Flex align="center" gap="xs">
              <Typography fz={{ base: 24, md: 32 }} fw={500}>
                {t("pages.connections.title")}
              </Typography>
              <AddConnectionButton />
            </Flex>
          </Flex>
          <Space h="sm" />
          <Flex direction="column" gap="xs">
            {connections &&
              connections.map((connection) => {
                return (
                  <ConnectionCard key={connection.id} connection={connection} />
                )
              })}
          </Flex>
        </Box>
      </Flex>
    </MainAppShell>
  )
}
