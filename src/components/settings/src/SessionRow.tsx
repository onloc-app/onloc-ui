import { deleteSession } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { formatISODate } from "@/helpers/utils"
import type { Session } from "@/types/types"
import { mdiDeleteOutline, mdiLogout } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface SessionRowProps {
  session: Session
}

export default function SessionRow({ session }: SessionRowProps) {
  const auth = useAuth()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const token = localStorage.getItem("refresh_token")
  const { t } = useTranslation()

  const deleteSessionMutation = useMutation({
    mutationFn: () => deleteSession(session.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["current_user_sessions"] }),
  })

  async function handleDeleteSession(session: Session) {
    if (!auth) return

    if (localStorage.getItem("refresh_token") === session.token) {
      auth.logoutAction()
    } else {
      deleteSessionMutation.mutate()
    }
  }

  const isActiveSession = token === session.token

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 1,
        border: isActiveSession
          ? `2px solid ${theme.palette.secondary.main}`
          : "1px solid",
        borderColor: isActiveSession
          ? theme.palette.secondary.main
          : theme.palette.divider,
        boxShadow: 3,
      }}
    >
      <CardContent>
        {isActiveSession && (
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              marginBottom: 1,
            }}
          >
            {t("components.session_row.current")}
          </Typography>
        )}
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 16, md: 24 },
            fontWeight: 500,
            color: theme.palette.primary.main,
          }}
        >
          {session.agent || session.id}
        </Typography>
        {session.updated_at ? (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: 12, md: 14 },
              marginTop: 0.5,
            }}
          >
            {`${t("components.session_row.last_used")}: ${formatISODate(session.updated_at)}`}
          </Typography>
        ) : null}
      </CardContent>
      <Tooltip
        title={
          isActiveSession
            ? t("components.session_row.logout")
            : t("components.session_row.delete_session")
        }
        enterDelay={500}
        placement="left"
      >
        <IconButton onClick={() => handleDeleteSession(session)}>
          {isActiveSession ? (
            <Icon path={mdiLogout} size={1} />
          ) : (
            <Icon path={mdiDeleteOutline} size={1} />
          )}
        </IconButton>
      </Tooltip>
    </Card>
  )
}
