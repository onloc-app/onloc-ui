import { deleteUser } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { User } from "@/types/types"
import { ActionIcon, Button, Group, Modal, Space, Tooltip } from "@mantine/core"
import { mdiAccountRemoveOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface DeleteUserButtonProps {
  user: User
  isSelf?: boolean
  detailedButton?: boolean
}

export default function DeleteUserButton({
  user,
  isSelf = false,
  detailedButton = false,
}: DeleteUserButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [opened, setOpened] = useState<boolean>(false)
  const [openedAt, setOpenedAt] = useState<Date | null>()
  const [secondsLeft, setSecondsLeft] = useState(5)

  const deleteUserMutation = useMutation({
    mutationFn: (id: bigint) => {
      return deleteUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
      handleClose()
    },
    onError: () => {
      auth.throwMessage("components.delete_user_button.error", Severity.ERROR)
    },
  })

  const handleDeleteAccount = () => {
    deleteUserMutation.mutate(user.id)
    if (isSelf) auth.logoutAction()
  }

  const handleOpen = () => {
    setOpened(true)
    setOpenedAt(new Date())
    setSecondsLeft(5)
  }
  const handleClose = () => {
    setOpened(false)
    setOpenedAt(null)
    setSecondsLeft(5)
  }

  useEffect(() => {
    if (!opened || !openedAt) return

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - openedAt.getTime()) / 1000,
      )
      const remaining = Math.max(5 - elapsed, 0)

      setSecondsLeft(remaining)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [opened, openedAt])

  const enableDelete = secondsLeft === 0

  return (
    <>
      {detailedButton ? (
        <Button color="error.5" onClick={handleOpen}>
          {isSelf
            ? t("components.delete_user_button.account_title")
            : t("components.delete_user_button.title", { name: user.username })}
        </Button>
      ) : (
        <Tooltip
          label={
            isSelf
              ? t("components.delete_user_button.account_tooltip")
              : t("components.delete_user_button.title", {
                  name: user.username,
                })
          }
        >
          <ActionIcon color="error.5" onClick={handleOpen}>
            <Icon path={mdiAccountRemoveOutline} size={1} />
          </ActionIcon>
        </Tooltip>
      )}

      <Modal
        opened={opened}
        onClose={handleClose}
        title={
          isSelf
            ? t("components.delete_user_button.account_title")
            : t("components.delete_user_button.title", { name: user.username })
        }
        centered
      >
        <Group>
          {t("components.delete_user_button.description", {
            name: isSelf
              ? t("components.delete_user_button.your_account")
              : t("components.delete_user_button.user", {
                  name: user.username,
                }),
          })}
        </Group>
        <Space h="xl" />
        <Group justify="end" gap="xs">
          <Button variant="subtle" onClick={handleClose}>
            {t("components.delete_user_button.cancel")}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={!enableDelete}
            color="error.5"
          >
            {enableDelete
              ? t("components.delete_user_button.delete")
              : secondsLeft}
          </Button>
        </Group>
      </Modal>
    </>
  )
}
