import { lockDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import {
  Button,
  Group,
  Modal,
  Space,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core"
import { mdiLockOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation } from "@tanstack/react-query"
import { useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"

interface LockDeviceButtonProps {
  device: Device
}

export default function LockDeviceButton({ device }: LockDeviceButtonProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const [opened, setOpened] = useState(false)
  const [message, setMessage] = useState<string>("")

  const handleOpen = () => {
    setOpened(true)
  }
  const handleClose = () => {
    setOpened(false)
  }

  const lockDeviceMutation = useMutation({
    mutationFn: (message: string | null = null) =>
      lockDevice(device.id, message),
    onSuccess: (status) => {
      if (status === 200) {
        auth.throwMessage(
          "components.lock_device_button.lock_sent",
          Severity.SUCCESS,
        )
      } else {
        auth.throwMessage(
          "components.lock_device_button.lock_queued",
          Severity.INFO,
        )
      }
    },
    onError: (error) => auth.throwMessage(error.message, Severity.ERROR),
  })

  const handleLock: SubmitEventHandler = async (e?) => {
    e?.preventDefault()

    lockDeviceMutation.mutate(
      message && message.trim().length > 0 ? message : null,
    )
    setMessage("")
    handleClose()
  }

  return (
    <>
      <Tooltip
        label={`${t("components.lock_device_button.lock")} ${device.name}`}
        openDelay={500}
        position="bottom"
      >
        <Button
          variant="subtle"
          color="default"
          radius="xl"
          rightSection={<Icon path={mdiLockOutline} size={1} />}
          onClick={handleOpen}
        >
          {t("components.lock_device_button.lock")}
        </Button>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${t("components.lock_device_button.lock")} ${device.name}`}
        centered
      >
        <form onSubmit={handleLock}>
          <Group>
            <Stack w="100%" px="md">
              <TextInput
                label={t("components.lock_device_button.message_label")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Stack>
          </Group>
          <Space h="xl" />
          <Group justify="end" gap="xs">
            <Button variant="subtle" onClick={handleClose}>
              {t("components.lock_device_button.cancel")}
            </Button>
            <Button type="submit">
              {t("components.lock_device_button.lock")}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  )
}
