import { Flex } from "@mantine/core"
import { TimePicker } from "@mantine/dates"
import { useEffect, useState } from "react"

interface TimeRangePickerProps {
  allowedHours: number[]
  onChange: (hours: [number, number]) => void
}

export default function TimeRangePicker({
  allowedHours,
  onChange,
}: TimeRangePickerProps) {
  const firstTime = allowedHours[0]
  const lastTime = allowedHours[allowedHours.length - 1]

  const [startTime, setStartTime] = useState(firstTime)
  const [endTime, setEndTime] = useState(lastTime)

  const startHours = allowedHours
    .filter((h) => h <= endTime)
    .map((h) => hourToString(h))
  const endHours = allowedHours
    .filter((h) => h >= startTime)
    .map((h) => hourToString(h))

  useEffect(() => {
    setStartTime(firstTime)
    setEndTime(lastTime)
  }, [firstTime, lastTime])

  const handleStartTimeChange = (strTime: string) => {
    const time = stringToHour(strTime)
    if (!allowedHours.some((h) => h === time)) return
    setStartTime(time)
    onChange([time, endTime])
  }

  const handleEndTimeChange = (strTime: string) => {
    const time = stringToHour(strTime)
    if (!allowedHours.some((h) => h === time)) return
    setEndTime(time)
    onChange([startTime, time])
  }

  function hourToString(hour: number) {
    return `${hour}:00`
  }

  function stringToHour(str: string) {
    return Number(str.split(":")[0])
  }

  return (
    <Flex w="100%" justify="space-evenly" gap="xs">
      <TimePicker
        flex={1}
        radius="lg"
        withDropdown
        onKeyDown={(e) => e.preventDefault()}
        presets={startHours}
        value={hourToString(startTime)}
        onChange={handleStartTimeChange}
      />
      <TimePicker
        flex={1}
        radius="lg"
        withDropdown
        onKeyDown={(e) => e.preventDefault()}
        presets={endHours}
        value={hourToString(endTime)}
        onChange={handleEndTimeChange}
      />
    </Flex>
  )
}
