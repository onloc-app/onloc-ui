import { DateRangePicker } from "@/components"
import { formatISODate } from "@/helpers/utils"
import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device } from "@/types/types"
import { mdiTune } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Dialog, IconButton, Tooltip, Typography } from "@mui/material"
import { useState } from "react"

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
  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const handleDialogOpen = () => {
    setDialogOpened(true)
  }
  const handleDialogClose = () => {
    setDialogOpened(false)
  }

  return (
    <>
      <Tooltip title="Tune locations settings">
        <IconButton onClick={handleDialogOpen}>
          <Icon path={mdiTune} size={1} />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <Box sx={{ padding: { xs: 2, sm: 4 } }}>
          <Box>
            <Typography variant="h5">Date</Typography>
            {selectedDevice?.latest_location?.created_at ? (
              <Typography color="gray" variant="subtitle1">
                {`Latest location: ${formatISODate(selectedDevice.latest_location.created_at)}`}
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
