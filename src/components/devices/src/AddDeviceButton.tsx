import { ApiError, postDevice } from "@/api"
import { DeviceIconsAutocomplete, Symbol } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { AvailableIcons, DeviceType, Severity } from "@/types/enums"
import { type Device } from "@/types/types"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"

interface AddDeviceButtonProps {
  disabled?: boolean
}

export default function AddDeviceButton({
  disabled = false,
}: AddDeviceButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const postDeviceMutation = useMutation({
    mutationFn: (device: Device) => {
      return postDevice(device)
    },
    onSuccess: () => {
      auth.throwMessage(
        t("components.add_device_button.device_added"),
        Severity.SUCCESS,
      )
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
        can_lock: type === DeviceType.MOBILE_APP,
      })
    } else {
      setNameError("components.add_device_button.name_required")
    }
  }

  return (
    <>
      <Tooltip
        title={t("components.add_device_button.add_a_device")}
        enterDelay={500}
        placement="right"
      >
        <IconButton disabled={disabled} onClick={handleDialogOpen}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <form onSubmit={handleCreateDevice}>
          <DialogTitle>
            {t("components.add_device_button.add_a_device")}
          </DialogTitle>
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
                label={t("components.add_device_button.name")}
                required
                size="small"
                error={nameError !== ""}
                helperText={t(nameError)}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="type" size="small">
                  {t("components.add_device_button.type")}
                </InputLabel>
                <Select
                  label={t("components.add_device_button.type")}
                  labelId="type"
                  value={type}
                  size="small"
                  onChange={(event) =>
                    setType(event.target.value as DeviceType)
                  }
                >
                  <MenuItem value={DeviceType.TRACKER}>
                    {t("enums.device_type.tracker")}
                  </MenuItem>
                  <MenuItem value={DeviceType.MOBILE_APP}>
                    {t("enums.device_type.mobile_app")}
                  </MenuItem>
                </Select>
              </FormControl>
              <DeviceIconsAutocomplete selectedIcon={icon} onChange={setIcon} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>
              {t("components.add_device_button.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateDevice}
              type="submit"
            >
              {t("components.add_device_button.add")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
