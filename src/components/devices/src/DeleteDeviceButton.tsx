import { ApiError, deleteDevice } from "@/api"
import { useAuth } from "@/contexts/AuthProvider"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { mdiDeleteOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface DeleteDeviceButtonProps {
  device: Device
}

export default function DeleteDeviceButton({
  device,
}: DeleteDeviceButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const deleteDeviceMutation = useMutation({
    mutationFn: (id: number) => {
      if (!auth) throw new Error()
      return deleteDevice(id)
    },
    onSuccess: () => {
      handleDialogClose()
      auth?.throwMessage("Device deleted", auth.Severity.SUCCESS)
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  return (
    <>
      <IconButton
        onClick={() => handleDialogOpen()}
        color="error"
        title={`Delete ${device.name}`}
      >
        <Icon path={mdiDeleteOutline} size={1} />
      </IconButton>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>{`Delete ${device.name || "selected device"}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The device and all of its associated data will be permanently
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteDeviceMutation.mutate(device.id)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
