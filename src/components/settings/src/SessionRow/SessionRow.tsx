import { deleteSession } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { formatISODate } from "@/helpers/utils"
import type { Session } from "@/types/types"
import { mdiDeleteOutline, mdiLogout } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { ActionIcon, Card, Text, Tooltip } from "@mantine/core"
import { getRefreshToken } from "@/helpers/localStorage"
import classes from "./SessionRow.module.css"

interface SessionRowProps {
  session: Session
}

export default function SessionRow({ session }: SessionRowProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const token = getRefreshToken()
  const { t } = useTranslation()

  const deleteSessionMutation = useMutation({
    mutationFn: () => deleteSession(session.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["current_user_sessions"] }),
  })

  async function handleDeleteSession() {
    if (!auth) return

    if (token === session.token) {
      auth.logoutAction()
    } else {
      deleteSessionMutation.mutate()
    }
  }

  const isActiveSession = token === session.token

  return (
    <Card withBorder>
      <div className={classes["container"]}>
        <div className={classes["information"]}>
          {isActiveSession && (
            <Text className={classes["information__current-session"]}>
              {t("components.session_row.current")}
            </Text>
          )}
          <Text className={classes["information__agent"]}>
            {session.agent || session.id}
          </Text>
          {session.updated_at && (
            <Text
              className={classes["information__date"]}
            >{`${t("components.session_row.last_used")}: ${formatISODate(session.updated_at)}`}</Text>
          )}
        </div>
        <div className={classes["actions"]}>
          <Tooltip
            label={
              isActiveSession
                ? t("components.session_row.logout")
                : t("components.session_row.delete_session")
            }
            position="left"
            openDelay={500}
          >
            <ActionIcon onClick={handleDeleteSession}>
              <Icon
                path={isActiveSession ? mdiLogout : mdiDeleteOutline}
                size={1}
              />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}
