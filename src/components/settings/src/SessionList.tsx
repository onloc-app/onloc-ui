import { getSessions } from "@/api"
import type { Session } from "@/types/types"
import { Typography, Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import SessionRow from "./SessionRow"
import { useTranslation } from "react-i18next"

export default function SessionList() {
  const { t } = useTranslation()

  const { data: sessions = [] } = useQuery({
    queryKey: ["current_user_sessions"],
    queryFn: async () => getSessions(),
  })

  if (sessions.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary">
        {t("components.session_list.no_session")}
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
        {t("components.session_list.sessions")}
      </Typography>
      {sessions.map((session: Session) => {
        return <SessionRow session={session} key={session.id} />
      })}
    </Box>
  )
}
