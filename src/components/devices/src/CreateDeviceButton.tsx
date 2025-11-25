import { ApiError, postDevice } from "@/api"
import { Symbol } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { toTitle } from "@/helpers/utils"
import { AvailableIcons, DeviceType, Severity } from "@/types/enums"
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
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"

export default function CreateDeviceButton() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const postDeviceMutation = useMutation({
    mutationFn: (device: Device) => {
      return postDevice(device)
    },
    onSuccess: () => {
      auth.throwMessage("Device created", Severity.SUCCESS)
      handleDialogClose()
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string>("")
  const [type, setType] = useState<DeviceType>(DeviceType.TRACKER)
  const [icon, setIcon] = useState<string>("")
  const resetForm = () => {
    setName("")
    setNameError("")
    setType(DeviceType.TRACKER)
    setIcon("")
  }

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  const handleCreateDevice = (event: FormEvent) => {
    event.preventDefault()

    setNameError("")

    if (name.trim() !== "") {
      postDeviceMutation.mutate({
        id: -1,
        user_id: auth.user?.id ?? 0,
        name: name,
        icon: icon,
        can_ring: type === DeviceType.MOBILE_APP,
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
                onChange={(event) => setName(event.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="type" size="small">
                  Type
                </InputLabel>
                <Select
                  label="type"
                  labelId="type"
                  value={type}
                  size="small"
                  onChange={(event) =>
                    setType(event.target.value as DeviceType)
                  }
                >
                  <MenuItem value={DeviceType.TRACKER}>
                    {toTitle(DeviceType.TRACKER)}
                  </MenuItem>
                  <MenuItem value={DeviceType.MOBILE_APP}>
                    {toTitle(DeviceType.MOBILE_APP)}
                  </MenuItem>
                </Select>
              </FormControl>
              <Box>
                <Autocomplete
                  size="small"
                  options={Object.keys(AvailableIcons)}
                  renderOption={(props, option) => {
                    const label = toTitle(option)

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
