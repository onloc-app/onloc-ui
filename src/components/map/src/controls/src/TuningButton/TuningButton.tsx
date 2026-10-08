import { DateRangePicker } from "@/components"
import { formatISODate } from "@/helpers/utils"
import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device } from "@/types/types"
import {
  ActionIcon,
  Modal,
  Text,
  Title,
  Tooltip,
  type FloatingPosition,
} from "@mantine/core"
import { mdiTune } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import classes from "./TuningButton.module.css"

interface TuningButtonProps {
  selectedDevice: Device
  availableDates: string[]
  dateRange: DateRangeState
  tooltipPosition?: FloatingPosition
}

export default function TuningButton({
  selectedDevice,
  availableDates,
  dateRange,
  tooltipPosition = "left",
}: TuningButtonProps) {
  const { t } = useTranslation()

  const [opened, setOpened] = useState<boolean>(false)
  const handleOpen = () => {
    setOpened(true)
  }
  const handleClose = () => {
    setOpened(false)
  }

  const title = t("components.map_controls.tune_location_settings")

  return (
    <>
      <Tooltip label={title} position={tooltipPosition}>
        <ActionIcon onClick={handleOpen}>
          <Icon path={mdiTune} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={handleClose} title={title} centered>
        <div className={classes["container"]}>
          <Title order={4}>{t("components.map_controls.date")}</Title>
          {selectedDevice?.latest_location?.created_at && (
            <Text className={classes["latest-location"]}>
              {`${t("components.map_controls.latest_location")}: ${formatISODate(selectedDevice.latest_location.created_at)}`}
            </Text>
          )}
          <DateRangePicker
            dateRangeState={dateRange}
            availableDates={availableDates}
            selectedDevice={selectedDevice}
          />
        </div>
      </Modal>
    </>
  )
}
