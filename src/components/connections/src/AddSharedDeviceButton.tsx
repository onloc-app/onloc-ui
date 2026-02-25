import { getDeviceShares, getDevices, postDeviceShare } from "@/api"
import { DevicesSelect } from "@/components"
import { type Connection, type Device, type DeviceShare } from "@/types/types"
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Space,
  Stack,
  Switch,
  Tooltip,
} from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type SubmitEventHandler } from "react"
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
      handleClose()
    },
  })

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [canRing, setCanRing] = useState(false)
  const [canLock, setCanLock] = useState(false)

  const [opened, setOpened] = useState(false)
  const handleOpen = () => setOpened(true)
  const handleClose = () => setOpened(false)

  const handleReset = () => {
    setSelectedDevice(null)
    setCanRing(false)
    setCanLock(false)
  }

  const handleAddSharedDevice: SubmitEventHandler = (e?) => {
    e?.preventDefault()

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
        label={t("components.add_shared_device_button.title")}
        openDelay={500}
        position="right"
      >
        <ActionIcon size="lg" onClick={handleOpen}>
          <Icon path={mdiPlus} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.add_shared_device_button.title")}
        centered
      >
        <form onSubmit={handleAddSharedDevice}>
          <Group>
            <Stack w="100%" px="md">
              <DevicesSelect
                devices={unaddedDevices}
                selectedDevice={selectedDevice}
                callback={setSelectedDevice}
                disableNoLocations={false}
              />
              <Switch
                label={t("components.add_shared_device_button.can_ring_label")}
                checked={canRing}
                onChange={(e) => setCanRing(e.target.checked)}
              />
              <Switch
                label={t("components.add_shared_device_button.can_lock_label")}
                checked={canLock}
                onChange={(e) => setCanLock(e.target.checked)}
              />
            </Stack>
          </Group>
          <Space h="xl" />
          <Group justify="end" gap="xs">
            <Button variant="subtle" onClick={handleClose}>
              {t("components.add_shared_device_button.cancel")}
            </Button>
            <Button type="submit" disabled={!selectedDevice}>
              {t("components.add_shared_device_button.add")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
