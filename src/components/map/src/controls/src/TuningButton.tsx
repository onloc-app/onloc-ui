import { DateRangePicker } from "@/components"
import { formatISODate } from "@/helpers/utils"
import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device } from "@/types/types"
import { mdiTune } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Dialog, IconButton, Tooltip, Typography } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface TuningButtonProps {
  selectedDevice: Device
  availableDates: string[]
  dateRange: DateRangeState
}

export default function TuningButton({
  selectedDevice,
  availableDates,
  dateRange,
}: TuningButtonProps) {
  const { t } = useTranslation()

  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  return (
    <>
      <Tooltip title={t("components.map_controls.tune_location_settings")}>
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiTune} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <Box sx={{ padding: { xs: 2, sm: 4 } }}>
          <Box>
            <Typography variant="h5">
              {t("components.map_controls.date")}
            </Typography>
            {selectedDevice?.latest_location?.created_at ? (
              <Typography color="gray" variant="subtitle1">
                {`${t("components.map_controls.latest_location")}: ${formatISODate(selectedDevice.latest_location.created_at)}`}
              </Typography>
            ) : null}
            <DateRangePicker
              dateRangeState={dateRange}
              availableDates={availableDates}
              selectedDevice={selectedDevice}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  )
}
