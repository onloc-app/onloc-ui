import { Flex } from "@mantine/core"
import { getTimeRange, TimePicker } from "@mantine/dates"
import { useEffect, useState } from "react"

interface TimeRangePickerProps {
  allowedHours: [number, number]
  onChange: (hours: [number, number]) => void
}

export default function TimeRangePicker({
  allowedHours,
  onChange,
}: TimeRangePickerProps) {
  const firstTime = allowedHours[0]
  const lastTime = allowedHours[allowedHours.length - 1]

  const [startTime, setStartTime] = useState(hourToString(firstTime))
  const [endTime, setEndTime] = useState(hourToString(lastTime))

  useEffect(() => {
    setStartTime(hourToString(firstTime))
    setEndTime(hourToString(lastTime))
  }, [firstTime, lastTime])

  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
    onChange([stringToHour(time), stringToHour(endTime)])
  }

  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
    onChange([stringToHour(startTime), stringToHour(time)])
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
        presets={getTimeRange({
          startTime: hourToString(firstTime),
          endTime: endTime,
          interval: "01",
        })}
        value={startTime}
        onChange={handleStartTimeChange}
      />
      <TimePicker
        flex={1}
        radius="lg"
        withDropdown
        presets={getTimeRange({
          startTime: startTime,
          endTime: hourToString(lastTime),
          interval: "01",
        })}
        value={endTime}
        onChange={handleEndTimeChange}
      />
    </Flex>
  )
}
