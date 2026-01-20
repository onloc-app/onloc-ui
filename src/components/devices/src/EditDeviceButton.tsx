import type { Device } from "@/types/types"
import { mdiPencilOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material"
import { useMemo, useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import DeviceIconAutocomplete from "./DeviceIconAutocomplete"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { patchDevice } from "@/api"

interface EditDeviceButtonProps {
  device: Device
}

export default function EditDeviceButton({ device }: EditDeviceButtonProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const patchDeviceMutation = useMutation({
    mutationFn: () =>
      patchDevice({
        id: device.id,
        user_id: device.user_id,
        name: name,
        icon: icon,
        can_ring: canRing,
        can_lock: canLock,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
  })

  const [name, setName] = useState(device.name)
  const [icon, setIcon] = useState(device.icon)
  const [canRing, setCanRing] = useState(device.can_ring)
  const [canLock, setCanLock] = useState(device.can_lock)

  const [dialogOpened, setDialogOpened] = useState(false)

  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  const handleUpdateDevice = (event: FormEvent) => {
    event.preventDefault()
    patchDeviceMutation.mutate()
    handleDialogClose()
  }

  const handleReset = () => {
    setName(device.name)
    setIcon(device.icon)
    setCanRing(device.can_ring)
    setCanLock(device.can_lock)
  }

  const isDifferent = useMemo(() => {
    let diff = false

    if (name !== device.name) diff = true
    if (icon !== device.icon) diff = true
    if (canRing !== device.can_ring) diff = true
    if (canLock !== device.can_lock) diff = true

    return diff
  }, [device, name, icon, canRing, canLock])

  return (
    <>
      <Tooltip
        title={`${t("components.edit_device_button.title")} ${device.name}`}
        enterDelay={500}
        placement="bottom"
      >
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiPencilOutline} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleUpdateDevice}>
          <DialogTitle>{`${t("components.edit_device_button.title")} ${device.name}`}</DialogTitle>
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
                label={t("components.edit_device_button.fields.name_label")}
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <DeviceIconAutocomplete selectedIcon={icon} onChange={setIcon} />
              <FormGroup>
                <FormControlLabel
                  label={t(
                    "components.edit_device_button.fields.can_ring_label",
                  )}
                  control={
                    <Switch
                      checked={canRing}
                      onChange={(event) => setCanRing(event.target.checked)}
                    />
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  label={t(
                    "components.edit_device_button.fields.can_lock_label",
                  )}
                  control={
                    <Switch
                      checked={canLock}
                      onChange={(event) => setCanLock(event.target.checked)}
                    />
                  }
                />
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            {isDifferent ? (
              <Button onClick={handleReset}>
                {t("components.edit_device_button.reset")}
              </Button>
            ) : null}
            <Button onClick={handleDialogClose}>
              {t("components.edit_device_button.cancel")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!isDifferent}
              onClick={handleUpdateDevice}
            >
              {t("components.edit_device_button.save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
