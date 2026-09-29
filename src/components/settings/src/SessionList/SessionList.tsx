import { getSessions } from "@/api"
import type { Session } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import SessionRow from "../SessionRow"
import { useTranslation } from "react-i18next"
import { Skeleton, Text, Title } from "@mantine/core"
import classes from "./SessionList.module.css"

export default function SessionList() {
  const { t } = useTranslation()

  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ["current_user_sessions"],
    queryFn: getSessions,
  })

  if (sessions.length <= 0) {
    return (
      <Text color="text.secondary">
        {t("components.session_list.no_session")}
      </Text>
    )
  }

  return (
    <div className={classes["container"]}>
      <Title>{t("components.session_list.sessions")}</Title>
      <div className={classes["list"]}>
        {!isSessionsLoading ? (
          sessions.map((session: Session) => {
            return <SessionRow session={session} key={session.id} />
          })
        ) : (
          <Skeleton height={64} />
        )}
      </div>
    </div>
  )
}
