import { deleteLocationsByUserId } from "@/api"
import type { User } from "@/types/types"
import { mdiMapMarkerRemoveOutline } from "@mdi/js"
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
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface DeleteUserLocationsButtonProps {
  user: User
  disabled?: boolean
}

export default function DeleteUserLocationsButton({
  user,
  disabled = false,
}: DeleteUserLocationsButtonProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)

  const deleteLocationsMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteLocationsByUserId(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] })
      handleDialogClose()
    },
  })

  const handleDeleteLocations = () => {
    deleteLocationsMutation.mutate(user.id)
  }

  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  return (
    <>
      <Tooltip title={t("components.delete_user_locations_button.tooltip")}>
        <IconButton onClick={handleDialogOpen} disabled={disabled}>
          <Icon path={mdiMapMarkerRemoveOutline} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>
          {t("components.delete_user_locations_button.title")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("components.delete_user_locations_button.description", {
              username: user.username,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {t("components.delete_user_locations_button.actions.cancel")}
          </Button>
          <Button
            onClick={handleDeleteLocations}
            variant="contained"
            color="error"
          >
            {t("components.delete_user_locations_button.actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
