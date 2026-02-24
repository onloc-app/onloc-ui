import { mdiHistory } from "@mdi/js"
import Icon from "@mdi/react"
import dayjs from "dayjs"
import type { Device } from "../../types/types"
import type { DateRangeState } from "../../hooks/useDateRange"
import { ActionIcon, Flex } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import "dayjs/locale/en"
import "dayjs/locale/fr"
import { useTranslation } from "react-i18next"

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
  const { startDate, setStartDate, endDate, setEndDate } = dateRangeState
  const { i18n } = useTranslation()

  const latestDate = dayjs(selectedDevice?.latest_location?.created_at)

  return (
    <Flex direction="column" gap="xs">
      <Flex align="center" gap="xs">
        <DatePickerInput
          flex={1}
          type="range"
          value={[startDate?.toDate() ?? null, endDate?.toDate() ?? null]}
          onChange={(newValue) => {
            if (!Array.isArray(newValue)) return

            const [start, end] = newValue

            setStartDate(start ? dayjs(start) : null)
            setEndDate(end ? dayjs(end) : null)
          }}
          excludeDate={(d) => {
            if (availableDates.length === 0) return true
            const formatted = dayjs(d).format("YYYY-MM-DD")
            return !availableDates.includes(formatted)
          }}
          disabled={startDate === null}
          allowSingleDateInRange
          locale={i18n.language}
          weekendDays={[]}
        />
        <ActionIcon
          onClick={() => {
            setStartDate(latestDate)
            setEndDate(latestDate)
          }}
        >
          <Icon path={mdiHistory} size={1} />
        </ActionIcon>
      </Flex>
    </Flex>
  )
}
