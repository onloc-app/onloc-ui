import type { Location } from "@/types/types"
import { RangeSlider } from "@mantine/core"
import dayjs from "dayjs"
import { useMemo } from "react"

interface TimeSliderProps {
  locations: Location[]
  allowedHours: [number, number]
  onChange: (hours: [number, number]) => void
}

export default function TimeSlider({
  locations,
  allowedHours,
  onChange,
}: TimeSliderProps) {
  const marks = useMemo(() => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour())),
    ).sort((a, b) => a - b)

    return uniqueHours.map((hour) => ({
      value: hour,
      label: hour.toString(),
    }))
  }, [locations])

  return (
    <RangeSlider
      min={0}
      max={23}
      minRange={0}
      marks={marks}
      value={allowedHours}
      onChange={onChange}
    />
  )
}
