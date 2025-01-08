import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { getSessions, deleteSession } from "./api";
import { useEffect, useState } from "react";
import { formatISODate } from "./utils";
import DeleteIcon from "@mui/icons-material/Delete";

function Settings() {
  const auth = useAuth();

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      const data = await getSessions(auth.token);
      if (data) {
        setSessions(data);
      }
    }
    fetchSessions();

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
              <DeleteIcon />
            </IconButton>
          </Card>
        );
      })}
    </Box>
  );
}

export default Settings;
