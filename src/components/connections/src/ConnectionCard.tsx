import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus } from "@/types/enums"
import type { Connection } from "@/types/types"
import { mdiAccountCircleOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Card, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import AcceptConnectionButton from "./AcceptConnectionButton"
import RejectConnectionButton from "./RejectConnectionButton"

interface ConnectionCardProps {
  connection: Connection
}

export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (connection.status === ConnectionStatus.REJECTED) return

  function DecisionButtons() {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <AcceptConnectionButton connection={connection} />
        <RejectConnectionButton connection={connection} />
      </Box>
    )
  }

  function PendingBox() {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>
          {t("components.connection_card.status.pending")}&hellip;
        </Typography>
        <RejectConnectionButton connection={connection} mode="cancel" />
      </Box>
    )
  }

  return (
    <Card sx={{ borderRadius: 3, height: 60 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          height: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Icon path={mdiAccountCircleOutline} size={1} />
          <Typography>{connection?.username}</Typography>
        </Box>
        {connection.status === ConnectionStatus.PENDING ? (
          connection.addressee_id === user!.id ? (
            <DecisionButtons />
          ) : (
            <PendingBox />
          )
        ) : null}
        {connection.status === ConnectionStatus.ACCEPTED ? (
          <RejectConnectionButton connection={connection} mode="remove" />
        ) : null}
      </Box>
    </Card>
  )
}
