import { ApiError, postDevice } from "@/api"
import { Symbol } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { capitalizeFirstLetter } from "@/helpers/utils"
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
  Tooltip,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"

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

  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [icon, setIcon] = useState<string>("")
  const resetCreateDevice = () => {
    setName("")
    setNameError("")
    setIcon("")
  }

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  const handleCreateDevice = (event: FormEvent) => {
    if (!auth) return

    event.preventDefault()

    setNameError("")

    if (name.trim() !== "") {
      postDeviceMutation.mutate({
        id: 0,
        user_id: auth.user?.id ?? 0,
        name: name,
        icon: icon,
        created_at: null,
        updated_at: null,
        latest_location: null,
      })
    } else {
      setNameError("Name is required")
    }
  }

  return (
    <>
      <Tooltip title="Create a device" enterDelay={500} placement="right">
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleCreateDevice}>
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
                error={nameError !== ""}
                helperText={nameError}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Box>
                <Autocomplete
                  size="small"
                  options={Object.keys(IconEnum)}
                  renderOption={(props, option) => {
                    const label = capitalizeFirstLetter(option)

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
                  renderInput={(params) => (
                    <TextField {...params} label="Icon" />
                  )}
                  onChange={(_, newValue) => setIcon(newValue || "")}
                  value={icon}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateDevice}
              type="submit"
            >
              Create
            </Button>
          </DialogActions>{" "}
        </form>
      </Dialog>
    </>
  )
}
