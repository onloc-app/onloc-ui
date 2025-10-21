import {
  deleteSession,
  getSessions,
  getSettings,
  patchSetting,
  postSetting,
} from "@/api"
import { MainAppBar } from "@/components"
import { useAuth } from "@/contexts/AuthProvider"
import { capitalizeFirstLetter, formatISODate } from "@/helpers/utils"
import type { Preference, Session, Setting } from "@/types/types"
import { mdiDeleteOutline, mdiLogout } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPreferences,
  patchPreference,
  postPreference,
} from "./api/src/preferenceApi"

type SettingType = "switch" | "toggle"

const SettingType = {
  SWITCH: "switch",
  TOGGLE: "toggle",
} as const

interface SettingTemplate {
  key: string
  desc: string
  defaultValue: string
  type: SettingType
  options?: string[]
}

interface SettingListProps {
  name: string
  settings: Setting[] | Preference[]
  settingTemplates: SettingTemplate[]
  onChange: (setting: Setting) => void
}

interface SettingCardProps {
  description: string
  setting: Setting | undefined
  defaultKey: string
  defaultValue: string
  type: SettingType
  onChange: (setting: Setting) => void
  options?: string[] | null
}

interface SessionListProps {
  token: string | null
  sessions: Session[]
  handleDeleteSession: (session: Session) => void
}

const serverSettingTemplates: SettingTemplate[] = [
  {
    key: "registration",
    desc: "Enable new user registration",
    defaultValue: "false",
    type: SettingType.SWITCH,
  },
]

const mapSettingTemplates: SettingTemplate[] = [
  {
    key: "defaultProjection",
    desc: "Default projection method",
    defaultValue: "mercator",
    type: SettingType.TOGGLE,
    options: ["mercator", "globe"],
  },
]

function Settings() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  // Settings queries
  const { data: serverSettings = [] } = useQuery<Setting[]>({
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

  const { data: userPreferences = [] } = useQuery<Preference[]>({
    queryKey: ["user_preferences", "default_map_projection"],
    queryFn: async () => {
      return getPreferences()
    },
  })

  const patchPreferenceMutation = useMutation({
    mutationFn: (updatedPreference: Preference) =>
      patchPreference(updatedPreference),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_preferences"] }),
  })

  const postPreferenceMutation = useMutation({
    mutationFn: (newPreference: Preference) => postPreference(newPreference),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_preferences"] }),
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

  function handleSettingChange(setting: Setting, isServerSetting: boolean) {
    if (isServerSetting) {
      if (setting.id) {
        patchSettingMutation.mutate(setting)
      } else {
        postSettingMutation.mutate({
          id: -1,
          key: setting.key,
          value: setting.value,
        })
      }
    } else {
      if (!auth?.user) return

      if (setting.id !== -1) {
        patchPreferenceMutation.mutate({
          id: setting.id,
          user_id: auth.user.id,
          key: setting.key,
          value: setting.value,
        })
      } else {
        postPreferenceMutation.mutate({
          id: -1,
          user_id: auth.user.id,
          key: setting.key,
          value: setting.value,
        })
      }
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
            <SettingList
              name="Server"
              settings={serverSettings}
              settingTemplates={serverSettingTemplates}
              onChange={(setting: Setting) => {
                handleSettingChange(setting, true)
              }}
            />
          ) : null}
          <SettingList
            name="Map"
            settings={userPreferences}
            settingTemplates={mapSettingTemplates}
            onChange={(setting: Setting) => {
              handleSettingChange(setting, false)
            }}
          />
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

function SettingList({
  name,
  settings,
  settingTemplates,
  onChange,
}: SettingListProps) {
  return (
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
        {name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {settingTemplates.map((settingTemplate, index) => {
          const setting = settings.find(
            (setting: Setting) => setting.key === settingTemplate.key,
          )

          return (
            <SettingCard
              key={index}
              description={settingTemplate.desc}
              setting={setting}
              defaultKey={settingTemplate.key}
              defaultValue={settingTemplate.defaultValue}
              type={settingTemplate.type}
              options={settingTemplate.options}
              onChange={(updatedSetting: Setting) => {
                onChange(updatedSetting)
              }}
            />
          )
        })}
      </Box>
      <Divider sx={{ my: 4 }} />
    </>
  )
}

function SettingCard({
  description,
  setting,
  defaultKey,
  defaultValue,
  type,
  onChange,
  options,
}: SettingCardProps) {
  switch (type) {
    case SettingType.SWITCH:
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {description}
          <Switch
            checked={
              setting?.value
                ? setting.value === "true"
                : defaultValue === "true"
            }
            onChange={(event) => {
              const newValue = event.target.checked ? "true" : "false"
              const newSetting = {
                id: setting?.id || -1,
                key: setting?.key || defaultKey,
                value: newValue,
              }
              onChange(newSetting)
            }}
          />
        </Card>
      )
    case SettingType.TOGGLE:
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {description}
          {options && options.length >= 2 ? (
            <ToggleButtonGroup
              value={setting?.value ? setting.value : defaultValue}
              exclusive
              onChange={(_, newValue) => {
                if (newValue) {
                  const newSetting = {
                    id: setting?.id || -1,
                    key: setting?.key || defaultKey,
                    value: newValue,
                  }
                  onChange(newSetting)
                }
              }}
            >
              {options.map((option) => {
                return (
                  <ToggleButton value={option}>
                    {capitalizeFirstLetter(option)}
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
          ) : null}
        </Card>
      )
  }
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
