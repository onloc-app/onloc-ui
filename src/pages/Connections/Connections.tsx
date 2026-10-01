import { getConnections } from "@/api"
import {
  AddConnectionButton,
  ConnectionCard,
  NotificationBadge,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus } from "@/types/enums"
import type { Connection } from "@/types/types"
import { Tabs, TabsList, TabsPanel, TabsTab, Title } from "@mantine/core"
import {
  mdiAccountMultiple,
  mdiAccountMultipleOutline,
  mdiClock,
  mdiClockOutline,
  mdiEmailFast,
  mdiEmailFastOutline,
} from "@mdi/js"
import { Icon } from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./Connections.module.css"

const TabOptions = {
  CONNECTIONS: "connections",
  PENDING: "pending",
  SENT: "sent",
} as const

interface PanelProps {
  connections?: Connection[]
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

  return (
    <div className={classes["container"]}>
      <div className={classes["container__inner"]}>
        <div className={classes["connections"]}>
          <div className={classes["connections__header"]}>
            <Title>{t("pages.connections.title")}</Title>
            <AddConnectionButton />
          </div>
          <Tabs variant="outline" value={activeTab} onChange={setActiveTab}>
            <TabsList grow>
              <TabsTab
                value={TabOptions.CONNECTIONS}
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
                  <NotificationBadge
                    connections={acceptedConnections}
                    variant="default"
                  />
                }
              >
                {t("pages.connections.tabs.connections.title")}
              </TabsTab>
              <TabsTab
                value={TabOptions.PENDING}
                leftSection={
                  <Icon
                    path={activeTab === "pending" ? mdiClock : mdiClockOutline}
                    size={1}
                  />
                }
                rightSection={
                  <NotificationBadge connections={pendingConnections} />
                }
              >
                {t("pages.connections.tabs.pending.title")}
              </TabsTab>
              <TabsTab
                value={TabOptions.SENT}
                leftSection={
                  <Icon
                    path={
                      activeTab === "sent" ? mdiEmailFast : mdiEmailFastOutline
                    }
                    size={1}
                  />
                }
                rightSection={
                  <NotificationBadge
                    connections={sentConnections}
                    variant="default"
                  />
                }
              >
                {t("pages.connections.tabs.sent.title")}
              </TabsTab>
            </TabsList>

            <Panel
              connections={acceptedConnections}
              value={TabOptions.CONNECTIONS}
            />
            <Panel
              connections={pendingConnections}
              value={TabOptions.PENDING}
            />
            <Panel connections={sentConnections} value={TabOptions.SENT} />
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Panel({ connections, value }: PanelProps) {
  return (
    <TabsPanel className={classes["panel"]} value={value}>
      {connections &&
        connections.map((connection) => {
          return <ConnectionCard key={connection.id} connection={connection} />
        })}
    </TabsPanel>
  )
}
