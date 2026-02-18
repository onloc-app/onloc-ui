import { patchDevice } from "@/api"
import type { Device } from "@/types/types"
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Space,
  Stack,
  Switch,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { mdiPencilOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"
import DeviceIconAutocomplete from "./DeviceIconAutocomplete"

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

  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    setOpened(true)
  }
  const handleClose = () => {
    setOpened(false)
  }

  const handleUpdateDevice: SubmitEventHandler = (e?) => {
    e?.preventDefault()
    patchDeviceMutation.mutate()
    handleClose()
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
        label={`${t("components.edit_device_button.title")} ${device.name}`}
        openDelay={500}
        position="bottom"
      >
        <ActionIcon onClick={handleOpen}>
          <Icon path={mdiPencilOutline} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${t("components.edit_device_button.title")} ${device.name}`}
        centered
      >
        <form onSubmit={handleUpdateDevice}>
          <Group>
            <Stack w="100%" px="md">
              <TextInput
                label={t("components.edit_device_button.fields.name_label")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <DeviceIconAutocomplete selectedIcon={icon} onChange={setIcon} />
              <Space />
              <Switch
                label={t("components.edit_device_button.fields.can_ring_label")}
                checked={canRing}
                onChange={(e) => setCanRing(e.target.checked)}
              />
              <Switch
                label={t("components.edit_device_button.fields.can_lock_label")}
                checked={canLock}
                onChange={(e) => setCanLock(e.target.checked)}
              />
            </Stack>
          </Group>
          <Space h="xl" />
          <Group justify="end" gap="xs">
            {isDifferent ? (
              <Button variant="subtle" onClick={handleReset}>
                {t("components.edit_device_button.reset")}
              </Button>
            ) : null}
            <Button variant="subtle" onClick={handleClose}>
              {t("components.edit_device_button.cancel")}
            </Button>
            <Button type="submit" disabled={!isDifferent}>
              {t("components.edit_device_button.save")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
