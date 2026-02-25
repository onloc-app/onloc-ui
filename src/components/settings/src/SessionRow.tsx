import { deleteSession } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { formatISODate } from "@/helpers/utils"
import type { Session } from "@/types/types"
import { mdiDeleteOutline, mdiLogout } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { ActionIcon, Card, Flex, Tooltip, Typography } from "@mantine/core"

interface SessionRowProps {
  session: Session
}

export default function SessionRow({ session }: SessionRowProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const token = localStorage.getItem("refresh_token")
  const { t } = useTranslation()

  const deleteSessionMutation = useMutation({
    mutationFn: () => deleteSession(session.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["current_user_sessions"] }),
  })

  async function handleDeleteSession() {
    if (!auth) return

    if (localStorage.getItem("refresh_token") === session.token) {
      auth.logoutAction()
    } else {
      deleteSessionMutation.mutate()
    }
  }

  const isActiveSession = token === session.token

  return (
    <Card>
      <Flex align="center" justify="space-between">
        <Flex direction="column">
          {isActiveSession ? (
            <Typography fw={600}>
              {t("components.session_row.current")}
            </Typography>
          ) : null}
          <Typography fz={{ base: 16, md: 24 }} fw={500} c="brand.3">
            {session.agent || session.id}
          </Typography>
          {session.updated_at ? (
            <Typography
              fz={{ base: 12, md: 14 }}
            >{`${t("components.session_row.last_used")}: ${formatISODate(session.updated_at)}`}</Typography>
          ) : null}
        </Flex>
        <Flex align="center">
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
        </Flex>
      </Flex>
    </Card>
  )
}
