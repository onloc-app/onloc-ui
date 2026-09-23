import { useState } from "react"
import { Sort } from "@/types/enums"
import { Icon } from "@mdi/react"
import { mdiChevronDown, mdiChevronUp } from "@mdi/js"
import { useTranslation } from "react-i18next"
import { ActionIcon, Select, Tooltip } from "@mantine/core"
import classes from "./SortSelect.module.css"

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
  const { t } = useTranslation()

  const [selectedOption, setSelectedOption] = useState<Sort>(defaultType)
  const [reversed, setReversed] = useState<boolean>(defaultReversed)

  const handleChange = (value: string | null) => {
    if (!value) return
    setSelectedOption(value as Sort)
    callback(value as Sort, reversed)
  }

  const handleReverse = () => {
    const newValue = !reversed
    setReversed(newValue)
    callback(selectedOption, newValue)
  }

  const formattedOptions = options.map((option) => {
    return {
      label: t(`enums.sort.${option}`),
      value: option,
    }
  })

  return (
    <div className={classes["container"]}>
      <Tooltip
        label={t("components.sort_select.inverse_list")}
        openDelay={500}
        position="left"
      >
        <ActionIcon onClick={handleReverse}>
          {reversed ? (
            <Icon path={mdiChevronUp} size={1} />
          ) : (
            <Icon path={mdiChevronDown} size={1} />
          )}
        </ActionIcon>
      </Tooltip>
      <Select
        value={selectedOption}
        data={formattedOptions}
        onChange={handleChange}
        checkIconPosition="right"
      />
    </div>
  )
}

export default SortSelect
