import { mdiHistory } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { Device } from "../../types/types"
import { DateRangeState } from "../../hooks/useDateRange"
import { useEffect } from "react"

interface DateRangePickerProps {
  dateRangeState: DateRangeState
  availableDates: string[]
  selectedDevice: Device | null
}

export default function DateRangePicker({
  dateRangeState,
  availableDates,
  selectedDevice,
}: DateRangePickerProps) {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isDateRange,
    setIsDateRange,
  } = dateRangeState

  /**
   * Resets end date when date range is disabled
   */
  useEffect(() => {
    if (!isDateRange) setEndDate(null)
  }, [isDateRange, setEndDate])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <DatePicker
          value={startDate}
          shouldDisableDate={(day) => {
            if (availableDates.length === 0) return true
            const formatted = day.format("YYYY-MM-DD")
            return !availableDates.includes(formatted)
          }}
          onChange={(newDate) => {
            setStartDate(newDate)
            if (newDate) {
              if (
                newDate.isSame(endDate, "day") ||
                newDate.isAfter(endDate, "day")
              ) {
                setEndDate(null)
              }
            }
          }}
        />
        <IconButton
          onClick={() => {
            setStartDate(dayjs(selectedDevice?.latest_location?.created_at))
            setEndDate(null)
          }}
        >
          <Icon path={mdiHistory} size={1} />
        </IconButton>
      </Box>
      {isDateRange ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DatePicker
            value={endDate}
            shouldDisableDate={(day) => {
              if (availableDates.length === 0) return true
              const formatted = day.format("YYYY-MM-DD")
              const isInvalid =
                day.isSame(startDate, "day") || day.isBefore(startDate, "day")
              return !availableDates.includes(formatted) || isInvalid
            }}
            onChange={(newDate) => setEndDate(newDate)}
          />
        </Box>
      ) : null}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={isDateRange}
              onChange={() => setIsDateRange(!isDateRange)}
            />
          }
          label="Range"
        />
      </FormGroup>
    </Box>
  )
}
