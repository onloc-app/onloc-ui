import { deleteSession, getSessions } from "@/api"
import { useAuth } from "@/contexts/AuthProvider"
import { formatISODate } from "@/helpers/utils"
import type { Session } from "@/types/types"
import { mdiLogout, mdiDeleteOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export default function SessionList() {
  const auth = useAuth()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const token = localStorage.getItem("refreshToken")

  const { data: sessions = [] } = useQuery({
    queryKey: ["current_user_sessions"],
    queryFn: async () => getSessions(),
  })

  const deleteSessionMutation = useMutation({
    mutationFn: (deletedSession: Session) => deleteSession(deletedSession.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["current_user_sessions"] }),
  })

  async function handleDeleteSession(session: Session) {
    if (!auth) return

    if (localStorage.getItem("refreshToken") === session.token) {
      auth.logoutAction()
    } else {
      deleteSessionMutation.mutate(session)
    }
  }

  if (sessions.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        No active sessions.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 24, md: 32 },
          fontWeight: 500,
          mb: 2,
          textAlign: { xs: "left", sm: "center", md: "left" },
        }}
      >
        Sessions
      </Typography>
      {sessions.map((session: Session) => {
        const isActiveSession = token === session.token
        return (
          <Card
            key={session.id}
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
                  Current Session
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
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: 12, md: 14 },
                  marginTop: 0.5,
                }}
              >
                Last used: {formatISODate(session.updated_at)}
              </Typography>
            </CardContent>
            <IconButton onClick={() => handleDeleteSession(session)}>
              {isActiveSession ? (
                <Icon path={mdiLogout} size={1} />
              ) : (
                <Icon path={mdiDeleteOutline} size={1} />
              )}
            </IconButton>
          </Card>
        )
      })}
    </Box>
  )
}
