import { DateRangePicker } from "@/components"
import { formatISODate } from "@/helpers/utils"
import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device } from "@/types/types"
import {
  ActionIcon,
  Flex,
  Group,
  Modal,
  Stack,
  Tooltip,
  Typography,
  type FloatingPosition,
} from "@mantine/core"
import { mdiTune } from "@mdi/js"
import Icon from "@mdi/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

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

  return (
    <>
      <Tooltip
        label={t("components.map_controls.tune_location_settings")}
        position={tooltipPosition}
      >
        <ActionIcon onClick={handleOpen}>
          <Icon path={mdiTune} size={1} />
        </ActionIcon>
      </Tooltip>

      <Modal opened={opened} onClose={handleClose} centered>
        <Group>
          <Stack w="100%" px="md">
            <Flex direction="column">
              <Typography fz={{ base: 18, md: 22 }} fw={500}>
                {t("components.map_controls.date")}
              </Typography>
              {selectedDevice?.latest_location?.created_at && (
                <Typography c="dimmed">
                  {`${t("components.map_controls.latest_location")}: ${formatISODate(selectedDevice.latest_location.created_at)}`}
                </Typography>
              )}
            </Flex>
            <DateRangePicker
              dateRangeState={dateRange}
              availableDates={availableDates}
              selectedDevice={selectedDevice}
            />
          </Stack>
        </Group>
      </Modal>
    </>
  )
}
