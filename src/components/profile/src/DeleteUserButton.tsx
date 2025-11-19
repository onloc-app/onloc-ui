import { deleteUser } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/types/types"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function DeleteUserButton() {
  const auth = useAuth()

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const [dialogOpenedAt, setDialogOpenedAt] = useState<Date | null>()
  const [secondsLeft, setSecondsLeft] = useState(5)

  const deleteUserMutation = useMutation({
    mutationFn: () => {
      if (!auth || !auth.user) throw new Error()
      return deleteUser(auth.user)
    },
  })

  const handleDeleteAccount = () => {
    deleteUserMutation.mutate()
    auth.logoutAction()
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
      <Button color="error" variant="contained" onClick={handleDialogOpen}>
        Delete Account
      </Button>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. Your account and all associated data
            will be permanently deleted. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={!enableDelete}
            variant="contained"
            color="error"
          >
            {enableDelete ? "Delete" : secondsLeft}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
