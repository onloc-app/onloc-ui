import { getSessions } from "@/api"
import type { Session } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import SessionRow from "./SessionRow"
import { useTranslation } from "react-i18next"
import { Flex, Skeleton, Space, Typography } from "@mantine/core"

export default function SessionList() {
  const { t } = useTranslation()

  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ["current_user_sessions"],
    queryFn: getSessions,
  })

  if (sessions.length === 0) {
    return (
      <Typography color="text.secondary">
        {t("components.session_list.no_session")}
      </Typography>
    )
  }

  return (
    <Flex direction="column">
      <Typography fz={{ base: 24, md: 32 }} fw={500}>
        {t("components.session_list.sessions")}
      </Typography>
      <Space h="sm" />
      <Flex direction="column" gap="xs">
        {!isSessionsLoading ? (
          sessions.map((session: Session) => {
            return <SessionRow session={session} key={session.id} />
          })
        ) : (
          <Skeleton height={64} />
        )}
      </Flex>
    </Flex>
  )
}
