import { ringDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"
import type { Device } from "@/types/types"
import { mdiPhoneRingOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Button, Tooltip } from "@mui/material"
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
        title={`${t("components.ring_device_button.ring")} ${device.name}`}
        enterDelay={500}
        placement="bottom"
      >
        <Button
          color="contrast"
          sx={{ paddingInline: 2, borderRadius: 9999 }}
          endIcon={<Icon path={mdiPhoneRingOutline} size={1} />}
          onClick={() => {
            ringDeviceMutation.mutate()
          }}
        >
          {t("components.ring_device_button.ring")}
        </Button>
      </Tooltip>
    </>
  )
}
