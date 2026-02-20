import { getDeviceShares, getDevices, postDeviceShare } from "@/api"
import { DevicesAutocomplete } from "@/components/devices"
import { type Connection, type Device, type DeviceShare } from "@/types/types"
import { mdiPlus } from "@mdi/js"
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
  Tooltip,
} from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"

interface AddSharedDeviceButtonProps {
  connection: Connection
}

export default function AddSharedDeviceButton({
  connection,
}: AddSharedDeviceButtonProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  })

  const { data: deviceShares = [] } = useQuery<DeviceShare[]>({
    queryKey: ["device_shares"],
    queryFn: getDeviceShares,
  })

  const unaddedDevices = useMemo<Device[]>(() => {
    let filteredDevices = [...devices]

    deviceShares.forEach((deviceShare) => {
      if (connection.id !== deviceShare.connection_id) return

      const device = deviceShare.device
      if (device) {
        filteredDevices = filteredDevices.filter((d) => d.id !== device.id)
      }
    })

    return filteredDevices
  }, [devices, deviceShares, connection])

  const postDeviceShareMutation = useMutation({
    mutationFn: (deviceShare: DeviceShare) => postDeviceShare(deviceShare),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["device_shares"],
      })
      queryClient.invalidateQueries({
        queryKey: ["shared_devices"],
      })
      handleReset()
      handleDialogClose()
    },
  })

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [canRing, setCanRing] = useState(false)
  const [canLock, setCanLock] = useState(false)

  const [dialogOpened, setDialogOpened] = useState(false)
  const handleDialogOpen = () => setDialogOpened(true)
  const handleDialogClose = () => setDialogOpened(false)

  const handleReset = () => {
    setSelectedDevice(null)
    setCanRing(false)
    setCanLock(false)
  }

  const handleAddSharedDevice = (e: FormEvent) => {
    e.preventDefault()

    if (!selectedDevice) return

    const newDeviceShare = {
      id: -1n,
      connection_id: connection.id,
      device_id: selectedDevice.id,
      can_ring: canRing,
      can_lock: canLock,
    }
    postDeviceShareMutation.mutate(newDeviceShare)
  }

  if (!devices || devices.length < 1) return

  return (
    <>
      <Tooltip
        title={t("components.add_shared_device_button.title")}
        enterDelay={500}
        placement="right"
      >
        <IconButton size="small" onClick={handleDialogOpen}>
          <Icon path={mdiPlus} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpened}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={handleAddSharedDevice}>
          <DialogTitle>
            {t("components.add_shared_device_button.title")}
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
              <DevicesAutocomplete
                devices={unaddedDevices}
                selectedDevice={selectedDevice}
                callback={setSelectedDevice}
                variant="outlined"
                disableNoLocations={false}
              />
              <FormGroup>
                <FormControlLabel
                  label={t(
                    "components.add_shared_device_button.can_ring_label",
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
                    "components.add_shared_device_button.can_lock_label",
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
            <Button onClick={handleDialogClose}>
              {t("components.add_shared_device_button.cancel")}
            </Button>
            <Button
              variant="contained"
              disabled={!selectedDevice}
              onClick={handleAddSharedDevice}
            >
              {t("components.add_shared_device_button.add")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
