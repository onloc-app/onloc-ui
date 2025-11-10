import type { Location } from "@/types/types"
import { Slider } from "@mui/material"
import type { Mark } from "@mui/material/Slider/useSlider.types"
import dayjs from "dayjs"
import { useCallback } from "react"

interface TimeSliderProps {
  locations: Location[]
  allowedHours: number[]
  onChange: (hours: number[]) => void
}

export default function TimeSlider({
  locations,
  allowedHours,
  onChange,
}: TimeSliderProps) {
  const generateSliderMarks = useCallback((): Mark[] => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour())),
    ).sort((a, b) => a - b)

    return uniqueHours.map((hour) => ({
      value: hour,
    }))
  }, [locations])

  return (
    <Slider
      orientation="vertical"
      min={0}
      max={23}
      step={null}
      marks={generateSliderMarks()}
      valueLabelDisplay="auto"
      value={allowedHours}
      onChange={(_, newValue, activeThumb) => {
        if (activeThumb === 0) {
          onChange([(newValue as number[])[0], allowedHours![1]])
        } else {
          onChange([allowedHours![0], (newValue as number[])[1]])
        }
      }}
    />
  )
}
