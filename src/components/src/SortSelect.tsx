import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  type SelectChangeEvent,
} from "@mui/material"
import { useState } from "react"
import { Sort } from "@/types/enums"
import Icon from "@mdi/react"
import { mdiChevronDown, mdiChevronUp } from "@mdi/js"

interface SortSelectProps {
  defaultType: Sort
  defaultReversed: boolean
  options: Sort[]
  callback: (option: Sort, reversed: boolean) => void
}

function SortSelect({
  defaultType,
  defaultReversed,
  options,
  callback,
}: SortSelectProps) {
  const [selectedOption, setSelectedOption] = useState<Sort>(defaultType)
  const [reversed, setReversed] = useState<boolean>(defaultReversed)

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as Sort)
    callback(event.target.value as Sort, reversed)
  }

  const handleReverse = () => {
    const newValue = !reversed
    setReversed(newValue)
    callback(selectedOption, newValue)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Tooltip title="Inverse list" enterDelay={500} placement="left">
        <IconButton size="small" onClick={handleReverse}>
          {reversed ? (
            <Icon path={mdiChevronUp} size={1} />
          ) : (
            <Icon path={mdiChevronDown} size={1} />
          )}
        </IconButton>
      </Tooltip>
      <FormControl size="small">
        <Select
          variant="standard"
          value={selectedOption}
          onChange={handleChange}
        >
          {options.map((option) => {
            return (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortSelect
