import { flashDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { Button, Tooltip } from "@mantine/core"
import { mdiLightbulbOnOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface FlashDeviceButtonProps {
  device: Device
}

export default function FlashDeviceButton({ device }: FlashDeviceButtonProps) {
  const auth = useAuth()
  const { t } = useTranslation()

  const flashDeviceMutation = useMutation({
    mutationFn: () => flashDevice(device.id),
    onSuccess: (status) => {
      if (status === 200) {
        auth.throwMessage(
          "components.flash_device_button.flash_sent",
          Severity.SUCCESS,
        )
      } else {
        auth.throwMessage(
          "components.flash_device_button.flash_queued",
          Severity.INFO,
        )
      }
    },
    onError: (error) => auth.throwMessage(error.message, Severity.ERROR),
  })

  return (
    <>
      <Tooltip
        label={t("components.flash_device_button.flash_tooltip", {
          deviceName: device.name,
        })}
        openDelay={500}
        position="bottom"
      >
        <Button
          variant="subtle"
          color="default"
          radius="xl"
          rightSection={<Icon path={mdiLightbulbOnOutline} size={1} />}
          onClick={() => flashDeviceMutation.mutate()}
        >
          {t("components.flash_device_button.flash_label")}
        </Button>
      </Tooltip>
    </>
  )
}
