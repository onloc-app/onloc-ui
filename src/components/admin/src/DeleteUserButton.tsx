import { deleteUser } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { User } from "@/types/types"
import { mdiAccountRemoveOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material"
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

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const [dialogOpenedAt, setDialogOpenedAt] = useState<Date | null>()
  const [secondsLeft, setSecondsLeft] = useState(5)

  const deleteUserMutation = useMutation({
    mutationFn: (user: User) => {
      return deleteUser(user)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
      handleDialogClose()
    },
    onError: () => {
      auth.throwMessage("components.delete_user_button.error", Severity.ERROR)
    },
  })

  const handleDeleteAccount = () => {
    deleteUserMutation.mutate(user)
    if (isSelf) auth.logoutAction()
  }

  const handleDialogOpen = () => {
    setDialogOpened(true)
    setDialogOpenedAt(new Date())
    setSecondsLeft(5)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
    setDialogOpenedAt(null)
    setSecondsLeft(5)
  }

  useEffect(() => {
    if (!dialogOpened || !dialogOpenedAt) return

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - dialogOpenedAt.getTime()) / 1000,
      )
      const remaining = Math.max(5 - elapsed, 0)

      setSecondsLeft(remaining)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [dialogOpened, dialogOpenedAt])

  const enableDelete = secondsLeft === 0

  return (
    <>
      {detailedButton ? (
        <Button color="error" variant="contained" onClick={handleDialogOpen}>
          {isSelf
            ? t("components.delete_user_button.account_title")
            : t("components.delete_user_button.title", { name: user.username })}
        </Button>
      ) : (
        <Tooltip
          title={
            isSelf
              ? t("components.delete_user_button.account_tooltip")
              : t("components.delete_user_button.title", {
                  name: user.username,
                })
          }
        >
          <IconButton color="error" onClick={handleDialogOpen}>
            <Icon path={mdiAccountRemoveOutline} size={1} />
          </IconButton>
        </Tooltip>
      )}
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>
          {isSelf
            ? t("components.delete_user_button.account_title")
            : t("components.delete_user_button.title", { name: user.username })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("components.delete_user_button.description", {
              name: isSelf
                ? t("components.delete_user_button.your_account")
                : t("components.delete_user_button.user", {
                    name: user.username,
                  }),
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {t("components.delete_user_button.cancel")}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={!enableDelete}
            variant="contained"
            color="error"
          >
            {enableDelete
              ? t("components.delete_user_button.delete")
              : secondsLeft}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
