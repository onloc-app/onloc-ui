import { Dayjs } from "dayjs"
import { useEffect, useState } from "react"

export interface DateRangeState {
  startDate: Dayjs | null
  setStartDate: React.Dispatch<React.SetStateAction<Dayjs | null>>
  endDate: Dayjs | null
  setEndDate: React.Dispatch<React.SetStateAction<Dayjs | null>>
  isDateRange: boolean
  setIsDateRange: React.Dispatch<React.SetStateAction<boolean>>
}

export default function useDateRange(): DateRangeState {
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [isDateRange, setIsDateRange] = useState(false)

  useEffect(() => {
    if (startDate?.isSame(endDate)) setIsDateRange(false)
    else setIsDateRange(true)
  }, [startDate, endDate])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isDateRange,
    setIsDateRange,
  }
}
