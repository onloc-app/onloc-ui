import { getConnections } from "@/api"
import { AddConnectionButton, ConnectionCard, MainAppShell } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus, NavOptions } from "@/types/enums"
import type { Connection } from "@/types/types"
import {
  Badge,
  Box,
  Flex,
  Space,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Typography,
} from "@mantine/core"
import {
  mdiAccountMultiple,
  mdiAccountMultipleOutline,
  mdiClock,
  mdiClockOutline,
  mdiEmailFast,
  mdiEmailFastOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface PanelProps {
  connections: Connection[]
  value: string
}

export default function Connections() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const { data: connections } = useQuery<Connection[]>({
    queryKey: ["connections"],
    queryFn: getConnections,
  })

  const [activeTab, setActiveTab] = useState<string | null>("connections")

  const acceptedConnections = connections?.filter(
    (c) => c.status === ConnectionStatus.ACCEPTED,
  )

  const pendingConnections = connections?.filter(
    (c) => c.status === ConnectionStatus.PENDING && c.addressee_id === user?.id,
  )

  const sentConnections = connections?.filter(
    (c) => c.status === ConnectionStatus.PENDING && c.requester_id === user?.id,
  )

  function Panel({ connections, value }: PanelProps) {
    return (
      <TabsPanel value={value}>
        <Space h="sm" />
        <Flex direction="column" gap="xs">
          {connections &&
            connections.map((connection) => {
              return (
                <ConnectionCard key={connection.id} connection={connection} />
              )
            })}
        </Flex>
      </TabsPanel>
    )
  }

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
          <Tabs variant="outline" value={activeTab} onChange={setActiveTab}>
            <TabsList grow>
              <TabsTab
                value="connections"
                leftSection={
                  <Icon
                    path={
                      activeTab === "connections"
                        ? mdiAccountMultiple
                        : mdiAccountMultipleOutline
                    }
                    size={1}
                  />
                }
                rightSection={
                  acceptedConnections &&
                  acceptedConnections.length > 0 && (
                    <Badge variant="default">
                      {acceptedConnections.length}
                    </Badge>
                  )
                }
              >
                {t("pages.connections.tabs.connections.title")}
              </TabsTab>
              <TabsTab
                value="pending"
                leftSection={
                  <Icon
                    path={activeTab === "pending" ? mdiClock : mdiClockOutline}
                    size={1}
                  />
                }
                rightSection={
                  pendingConnections &&
                  pendingConnections.length > 0 && (
                    <Badge>{pendingConnections.length}</Badge>
                  )
                }
              >
                {t("pages.connections.tabs.pending.title")}
              </TabsTab>
              <TabsTab
                value="sent"
                leftSection={
                  <Icon
                    path={
                      activeTab === "sent" ? mdiEmailFast : mdiEmailFastOutline
                    }
                    size={1}
                  />
                }
                rightSection={
                  sentConnections &&
                  sentConnections.length > 0 && (
                    <Badge variant="default">{sentConnections.length}</Badge>
                  )
                }
              >
                {t("pages.connections.tabs.sent.title")}
              </TabsTab>
            </TabsList>

            <Panel
              connections={acceptedConnections || []}
              value="connections"
            />
            <Panel connections={pendingConnections || []} value="pending" />
            <Panel connections={sentConnections || []} value="sent" />
          </Tabs>
        </Box>
      </Flex>
    </MainAppShell>
  )
}
