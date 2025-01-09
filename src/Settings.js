import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import {
  getSessions,
  deleteSession,
  getSettings,
  patchSetting,
  postSetting,
} from "./api";
import { useEffect, useState } from "react";
import { formatISODate } from "./utils";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const availableSettings = [
  {
    name: "registration",
    desc: "Enable new user registration",
    initValue: "true",
  },
];

function Settings() {
  const auth = useAuth();

  const [sessions, setSessions] = useState([]);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      const data = await getSessions(auth.token);
      if (data) {
        setSessions(data);
      }
    }
    fetchSessions();

    async function fetchSettings() {
      const data = await getSettings(auth.token);
      if (data) {
        setSettings(data);
      }
    }
    if (auth.user.admin) {
      fetchSettings();
    }

    const updateInterval = setInterval(() => fetchSessions(), 60000);
    return () => clearInterval(updateInterval);
  }, []);

  async function handleDeleteSession(id) {
    if (parseInt(auth.token.split("|")[0]) === id) {
      auth.logoutAction();
    } else {
      const response = await deleteSession(auth.token, id);
      if (!response.status) {
        setSessions((prev) => prev.filter((session) => session.id !== id));
      }
    }
  }

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
                  return (
                    <SettingCard
                      key={index}
                      desc={availableSetting.desc}
                      setting={
                        settings.find(
                          (setting) => setting.key === availableSetting.name
                        ) ?? null
                      }
                      onChange={(updatedSetting) => {
                        if (updatedSetting) {
                          const newSettings = settings.map((setting) =>
                            setting.key === updatedSetting.key
                              ? updatedSetting
                              : setting
                          );
                          setSettings(newSettings);
                          patchSetting(auth.token, updatedSetting);
                        } else {
                          async function createSetting() {
                            const response = await postSetting(auth.token, {
                              key: availableSetting.name,
                              value: availableSetting.initValue,
                            });
                            setSettings((settings) => [
                              settings,
                              response.setting,
                            ]);
                          }
                          createSetting();
                        }
                      }}
                    />
                  );
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
            tokenId={parseInt(auth.token.split("|")[0])}
            sessions={sessions}
            handleDeleteSession={handleDeleteSession}
          />
        </Box>
      </Box>
    </>
  );
}

function SettingCard({ desc, setting, onChange }) {
  const isChecked = setting?.value === "true";

  return (
    <Card sx={{ padding: 1.5 }}>
      <Switch
        checked={isChecked}
        onChange={(event) => {
          const newValue = event.target.checked ? "true" : "false";
          if (onChange) {
            const newSetting = setting ? { ...setting, value: newValue } : null;
            onChange(newSetting);
          }
        }}
      />
      {desc}
    </Card>
  );
}

function SessionList({ tokenId, sessions, handleDeleteSession }) {
  const theme = useTheme();

  if (sessions.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        No active sessions.
      </Typography>
    );
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
        const isActiveSession = tokenId === session.id;
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
                {session.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: 12, md: 14 },
                  marginTop: 0.5,
                }}
              >
                Last used: {formatISODate(session.last_used_at)}
              </Typography>
            </CardContent>
            <IconButton onClick={() => handleDeleteSession(session.id)}>
              {isActiveSession ? (
                <LogoutOutlinedIcon />
              ) : (
                <DeleteOutlinedIcon />
              )}
            </IconButton>
          </Card>
        );
      })}
    </Box>
  );
}

export default Settings;
