import { ringDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { Button, Tooltip } from "@mantine/core"
import { mdiPhoneRingOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface RingDeviceButtonProps {
  device: Device
}

export default function RingDeviceButton({ device }: RingDeviceButtonProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const ringDeviceMutation = useMutation({
    mutationFn: () => ringDevice(device.id),
    onSuccess: (status) => {
      if (status === 200) {
        auth.throwMessage(
          "components.ring_device_button.ring_sent",
          Severity.SUCCESS,
        )
      } else {
        auth.throwMessage(
          "components.ring_device_button.ring_queued",
          Severity.INFO,
        )
      }
    },
    onError: (error) => auth.throwMessage(error.message, Severity.ERROR),
  })

  return (
    <>
      <Tooltip
        label={`${t("components.ring_device_button.ring")} ${device.name}`}
        openDelay={500}
        position="bottom"
      >
        <Button
          variant="subtle"
          color="default"
          radius="xl"
          rightSection={<Icon path={mdiPhoneRingOutline} size={1} />}
          onClick={() => ringDeviceMutation.mutate()}
        >
          {t("components.ring_device_button.ring")}
        </Button>
      </Tooltip>
    </>
  )
}
