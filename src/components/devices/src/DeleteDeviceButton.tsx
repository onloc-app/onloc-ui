import { ApiError, deleteDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { ActionIcon, Button, Group, Modal, Space, Tooltip } from "@mantine/core"
import { mdiDeleteOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface DeleteDeviceButtonProps {
  device: Device
}

export default function DeleteDeviceButton({
  device,
}: DeleteDeviceButtonProps) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const deleteDeviceMutation = useMutation({
    mutationFn: () => {
      if (!auth) throw new Error()
      return deleteDevice(device.id)
    },
    onSuccess: () => {
      handleClose()
      auth?.throwMessage(
        "components.delete_device_button.deleted_message",
        auth.Severity.SUCCESS,
      )
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    },
    onError: (error: ApiError) => {
      auth?.throwMessage(error.message, Severity.ERROR)
    },
  })

  const [opened, setOpened] = useState(false)
  const handleOpen = () => {
    setOpened(true)
  }
  const handleClose = () => {
    setOpened(false)
  }

  return (
    <>
      <Tooltip
        label={`${t("components.delete_device_button.delete")} ${device.name}`}
        openDelay={500}
        position="bottom"
      >
        <ActionIcon onClick={handleOpen} color="error.5">
          <Icon path={mdiDeleteOutline} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${t("components.delete_device_button.delete")} ${device.name}?`}
        centered
      >
        <Group>{t("components.delete_device_button.description")}</Group>
        <Space h="xl" />
        <Group justify="end" gap="xs">
          <Button variant="subtle" onClick={handleClose}>
            {t("components.delete_user_button.cancel")}
          </Button>
          <Button onClick={() => deleteDeviceMutation.mutate()} color="error.5">
            {t("components.delete_device_button.delete")}
          </Button>
        </Group>
      </Modal>
    </>
  )
}
