import { ApiError, deleteDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
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
  Tooltip,
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
    mutationFn: () => {
      if (!auth) throw new Error()
      return deleteDevice(device.id)
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
      <Tooltip
        title={`Delete ${device.name}`}
        enterDelay={500}
        placement="bottom"
      >
        <IconButton onClick={() => handleDialogOpen()} color="error">
          <Icon path={mdiDeleteOutline} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>{`Delete ${device.name}?`}</DialogTitle>
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
              deleteDeviceMutation.mutate()
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
