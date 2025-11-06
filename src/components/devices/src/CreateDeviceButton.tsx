import { ApiError, postDevice } from "@/api"
import { Symbol } from "@/components"
import { useAuth } from "@/contexts/AuthProvider"
import { IconEnum, Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Autocomplete,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function CreateDeviceButton() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const postDeviceMutation = useMutation({
    mutationFn: (device: Device) => {
      if (!auth) throw new Error()
      return postDevice(device)
    },
    onSuccess: () => {
      auth?.throwMessage("Device created", Severity.SUCCESS)
      handleDialogClose()
      resetCreateDevice()
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [deviceName, setDeviceName] = useState<string>("")
  const [deviceIcon, setDeviceIcon] = useState<string>("")
  const resetCreateDevice = () => {
    setDeviceName("")
    setDeviceIcon("")
  }

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  return (
    <>
      <IconButton onClick={handleDialogOpen}>
        <Icon path={mdiPlus} size={1} />
      </IconButton>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>Create a Device</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              paddingTop: 1,
            }}
          >
            <TextField
              label="Name"
              required
              size="small"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
            <Box>
              <Autocomplete
                size="small"
                options={Object.keys(IconEnum)}
                renderOption={(props, option) => {
                  const label = option
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())

                  return (
                    <li {...props}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mr: 1,
                        }}
                      >
                        <Symbol name={option} />
                      </Box>
                      {label}
                    </li>
                  )
                }}
                renderInput={(params) => <TextField {...params} label="Icon" />}
                onChange={(_, newValue) => setDeviceIcon(newValue || "")}
                value={deviceIcon}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!auth) return

              postDeviceMutation.mutate({
                id: 0,
                user_id: auth.user?.id ?? 0,
                name: deviceName,
                icon: deviceIcon,
                created_at: null,
                updated_at: null,
                latest_location: null,
              })
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
