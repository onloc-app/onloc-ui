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

interface DeleteUserLocationsButtonProps {
  user: User
  disabled?: boolean
}

export default function DeleteUserLocationsButton({
  user,
  disabled = false,
}: DeleteUserLocationsButtonProps) {
  const queryClient = useQueryClient()

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
      <Tooltip title={`Delete locations`}>
        <IconButton onClick={handleDialogOpen} disabled={disabled}>
          <Icon path={mdiMapMarkerRemoveOutline} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>Delete Locations</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`This action is irreversible. Every location associated with user ${user.username} will be permanently deleted. Are you sure you want
            to continue?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleDeleteLocations}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
