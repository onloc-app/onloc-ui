import { useAuth } from "@/contexts/AuthProvider"
import { MainAppBar } from "@/components"
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material"
import {
  getSessions,
  deleteSession,
  getSettings,
  patchSetting,
  postSetting,
} from "@/api"
import type { Session, Setting } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { formatISODate } from "@/helpers/utils"
import Icon from "@mdi/react"
import { mdiDeleteOutline, mdiLogout } from "@mdi/js"

interface SettingCardProps {
  description: string
  setting: Setting
  onChange: (setting: Setting) => void
}

interface SessionListProps {
  token: string | null
  sessions: Session[]
  handleDeleteSession: (session: Session) => void
}

const availableSettings = [
  {
    name: "registration",
    desc: "Enable new user registration",
    initValue: "true",
  },
]

function Settings() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  // Settings queries
  const { data: settings = [] } = useQuery({
    queryKey: ["server_settings"],
    queryFn: async () => {
      if (!auth?.user?.admin) return []
      return getSettings()
    },
  })

  const patchSettingMutation = useMutation({
    mutationFn: (updatedSetting: Setting) => patchSetting(updatedSetting),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["server_settings"] }),
  })

  const postSettingMutation = useMutation({
    mutationFn: (newSetting: Setting) => postSetting(newSetting),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["server_settings"] }),
  })

  // Sessions queries
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

  if (!auth) return
  if (!auth.user) return

  return (
    <>
      <MainAppBar selectedNav="settings" />
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
            width: { xs: "100%", sm: "80%", md: "60%" },
            height: "100%",
            padding: 1,
          }}
        >
          {auth.user.admin ? (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 500,
                  mb: 2,
                  textAlign: { xs: "left", sm: "center", md: "left" },
                }}
              >
                Server Settings
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {availableSettings.map((availableSetting, index) => {
                  const setting = settings.find(
                    (setting: Setting) => setting.key === availableSetting.name
                  )

                  return (
                    <SettingCard
                      key={index}
                      description={availableSetting.desc}
                      setting={setting}
                      onChange={(updatedSetting: Setting) => {
                        if (updatedSetting.id) {
                          patchSettingMutation.mutate(updatedSetting)
                        } else {
                          postSettingMutation.mutate({
                            id: 0,
                            key: availableSetting.name,
                            value: availableSetting.initValue,
                          })
                        }
                      }}
                    />
                  )
                })}
              </Box>
              <Divider sx={{ my: 4 }} />
            </>
          ) : (
            ""
          )}
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
          <SessionList
            token={localStorage.getItem("refreshToken")}
            sessions={sessions}
            handleDeleteSession={handleDeleteSession}
          />
        </Box>
      </Box>
    </>
  )
}

function SettingCard({ description, setting, onChange }: SettingCardProps) {
  const isChecked = setting?.value === "true"

  return (
    <Card sx={{ padding: 1.5 }}>
      <Switch
        checked={isChecked}
        onChange={(event) => {
          const newValue = event.target.checked ? "true" : "false"
          if (onChange) {
            const newSetting = { ...setting, value: newValue }
            onChange(newSetting)
          }
        }}
      />
      {description}
    </Card>
  )
}

function SessionList({
  token,
  sessions,
  handleDeleteSession,
}: SessionListProps) {
  const theme = useTheme()

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
      {sessions.map((session) => {
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

export default Settings
